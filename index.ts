import { deepEquals, inspect, randomUUIDv7 } from 'bun'
import { Hono } from 'hono'
import { serveStatic, upgradeWebSocket, websocket } from 'hono/bun'
import type { WSContext } from 'hono/ws'
import { questions, type Question } from './questions'
import z from 'zod'
// @ts-ignore
import piston from 'piston-client'

const pistonClient = piston({ server: 'http://how-did-i-get-here.net:2000/' })

const app = new Hono()

const clientMessageSchema = z.union([
    z.object({
        kind: z.literal('joinRoom'),
        password: z.string(),
        seen: z.string().array(),
        lang: z.enum([ 'js', 'py' ]),
    }),
    z.object({ kind: z.literal('letter'), letter: z.string() }),
    z.object({ kind: z.literal('leaveRoom') }),
    z.object({ kind: z.literal('heartbeat') }),
    z.object({ kind: z.literal('submit') }),
    z.object({
        kind: z.literal('play'),
        mode: z.optional(z.enum([ 'normal', 'competitive' ])),
    }),
])

type ServerMessage =
    | {
        kind: 'gameState'
        gameState: ClientGameState | null // null if you're not in a room
    }

type WS = WSContext<unknown>

type SubmissionState = 'notStarted' | 'inGame' | 'submitting' | 'correct' | 'incorrect' | 'timedOut' | 'timedOutCorrect'

type Mode = 'normal' | 'competitive'

interface ClientGameState {
    playerCount: number
    question: string
    currentPlayer: number
    lastLetter: {
        player: number
        letter: string
    } | null
    yourPlayer: number
    timerEnd: number
    submissionState: SubmissionState
    submittingPlayer: number | null
    fullString: string | null
    error: string | null
    mode: Mode
}

interface Room {
    lang: Lang
    password: string
    question: Question
    playerSockets: string[]
    currentPlayer: number
    lastLetter: {
        player: number
        letter: string
    } | null
    fullString: string
    timerEnd: number
    submissionState: SubmissionState
    submittingPlayer: number | null
    error: string | null
    playersSeen: Record<string, Set<string>>
    previousQuestions: Set<string>
    timerTimeout: Timer | null
    mode: Mode
}

type Lang = 'py' | 'js'

const rooms: Record<Lang, Record<string, Room>> = {
    py: {},
    js: {},
}
const wsById: Record<string, WS> = {}

function findRoomFromWs(id: string): Room | null {
    for (const langRooms of Object.values(rooms)) {
        for (const roomString in langRooms) {
            const room = langRooms[roomString]
            if (room?.playerSockets.includes(id)) {
                return room
            }
        }
    }
    return null
}

function stateFromRoom(room: Room, id: string): ClientGameState {
    return {
        playerCount: room.playerSockets.length,
        question: room.question.question,
        currentPlayer: room.currentPlayer,
        lastLetter: room.lastLetter,
        yourPlayer: room.playerSockets.indexOf(id),
        timerEnd: room.timerEnd,
        submissionState: room.submissionState,
        submittingPlayer: room.submittingPlayer,
        fullString: (room.submissionState === 'correct' || room.submissionState === 'incorrect' || room.submissionState === 'timedOut' || room.submissionState === 'timedOutCorrect')
            ? room.fullString : null,
        error: room.error,
        mode: room.mode,
    }
}

function broadcastRoomState(room: Room) {
    for (const id of room.playerSockets) {
        send(id, {
            kind: 'gameState',
            gameState: stateFromRoom(room, id)
        })
    }
}

function leaveRoom(id: string) {
    const room = findRoomFromWs(id)
    if (!room) return
    room.playerSockets.splice(room.playerSockets.indexOf(id), 1)
    delete room.playersSeen[id]
    room.currentPlayer = room.currentPlayer % room.playerSockets.length
    if (room.playerSockets.length === 0) {
        delete rooms[room.lang][room.password]
    } else {
        broadcastRoomState(room)
        send(id, { kind: 'gameState', gameState: null })
    }
}

function send(id: string, message: ServerMessage) {
    wsById[id]?.send(JSON.stringify(message))
}

function loadQuestion(room: Room) {
    for (let expectedUnseen = Object.keys(room.playersSeen).length; expectedUnseen >= 0; expectedUnseen--) {
        const questionPool = questions.filter((question) => Object
            .values(room.playersSeen)
            .filter((seen) => !seen.has(question.question) && !room.previousQuestions.has(question.question))
            .length >= expectedUnseen)

        if (questionPool.length > 0) {
            room.question = questionPool[Math.floor(Math.random() * questionPool.length)]!
            room.previousQuestions.add(room.question.question)
            return
        }
    }

    room.previousQuestions.clear()
    return loadQuestion(room)
}

function pythonify(arg: unknown): string {
    const trueUid = randomUUIDv7()
    const falseUid = randomUUIDv7()
    return JSON.stringify(arg, (_k, v) => typeof v === 'boolean' ? v ? trueUid : falseUid : v)
        .replaceAll(`"${trueUid}"`, 'True')
        .replaceAll(`"${falseUid}"`, 'False')
}

// Returns an error string if it failed
async function verifyCode(room: Room): Promise<string | null> {
    for (const testCase of room.question.testCases) {
        const code = room.lang === 'js'
            ? `${room.fullString}\n\nconsole.log(JSON.stringify(f(${JSON.stringify(testCase.args).slice(1, -1)})))`
            : `${room.fullString}

import json
print(json.dumps(f(${pythonify(testCase.args).slice(1, -1)})))`

        const result = await pistonClient.execute(room.lang === 'js' ? 'javascript' : 'python', code)

        console.log(result)
        if (result.run.code === 0) {
            const data = JSON.parse(result.run.stdout.trim().split('\n').at(-1))
            if (!deepEquals(data, testCase.result)) {
                const _inspect = (thing: unknown) => room.lang === 'js' ? inspect(thing, { compact: true }) : pythonify(thing)
                const called = 'f(' + testCase.args.map((arg) => _inspect(arg)).join(', ') + ')'
                const expected = _inspect(testCase.result)
                const actual = _inspect(data)
                return `Incorrect result for ${called}. Expected: ${expected}, got: ${actual}`
            }
        } else if (result.run.signal) {
            return result.run.signal
        } else {
            const error = room.lang === 'js'
                ? result.run.stderr.split('\n')[4]
                : result.run.stderr.trim().split('\n').at(-1)
            return error
        }
    }
    return null
}

app.use('*', serveStatic({ root: './static' }))

app.get('/ws', upgradeWebSocket(() => {
    let heartbeatTimeout: Timer

    const id = randomUUIDv7()

    return {
        async onMessage(event, ws) {
            try {
                wsById[id] = ws

                if (!heartbeatTimeout) heartbeatTimeout = setTimeout(() => leaveRoom(id), 2000)

                const data = clientMessageSchema.parse(JSON.parse(event.data.toString()))

                if (data.kind === 'joinRoom') {
                    let room: Room

                    if (rooms[data.lang][data.password]) {
                        room = rooms[data.lang][data.password]!
                        room.playerSockets.push(id)
                        room.playersSeen[id] = new Set(data.seen)
                    } else {
                        room = {
                            lang: data.lang,
                            password: data.password,
                            question: null as any,
                            playerSockets: [ id ],
                            currentPlayer: 0,
                            lastLetter: null,
                            fullString: '',
                            submissionState: 'notStarted',
                            submittingPlayer: null,
                            timerEnd: 0,
                            error: null,
                            previousQuestions: new Set(),
                            playersSeen: {
                                [id]: new Set(data.seen),
                            },
                            timerTimeout: null,
                            mode: 'normal',
                        }

                        loadQuestion(room)

                        rooms[data.lang][data.password] = room
                    }

                    broadcastRoomState(room)
                } else if (data.kind === 'letter') {
                    const room = findRoomFromWs(id)
                    if (!room || room.currentPlayer !== room.playerSockets.indexOf(id) || room.submissionState !== 'inGame') return

                    room.lastLetter = {
                        player: room.currentPlayer,
                        letter: data.letter
                    }
                    room.fullString += data.letter
                    room.currentPlayer = (room.currentPlayer + 1) % room.playerSockets.length

                    broadcastRoomState(room)
                } else if (data.kind === 'leaveRoom') {
                    leaveRoom(id)
                } else if (data.kind === 'heartbeat') {
                    clearTimeout(heartbeatTimeout)
                    heartbeatTimeout = setTimeout(() => leaveRoom(id), 2000)
                } else if (data.kind === 'submit') {
                    const room = findRoomFromWs(id)
                    if (!room || room.currentPlayer !== room.playerSockets.indexOf(id) || room.submissionState !== 'inGame') return

                    if (room.timerTimeout !== null) clearTimeout(room.timerTimeout)
                    room.submissionState = 'submitting'
                    broadcastRoomState(room)

                    room.error = await verifyCode(room)
                    room.submissionState = room.error ? 'incorrect' : 'correct'
                    room.submittingPlayer = room.playerSockets.indexOf(id)
                    broadcastRoomState(room)
                    loadQuestion(room)
                } else if (data.kind === 'play') {
                    const room = findRoomFromWs(id)
                    if (!room
                        || room.submissionState === 'inGame'
                        || room.submissionState === 'submitting') return

                    room.submissionState = 'inGame'
                    room.lastLetter = null
                    room.currentPlayer = Math.floor(Math.random() * room.playerSockets.length)
                    room.fullString = ''
                    room.error = null
                    room.mode = data.mode as Mode

                    const timer = 1000 * 60 * 3 // 3 minutes
                    room.timerEnd = Date.now() + timer
                    if (room.timerTimeout !== null) clearTimeout(room.timerTimeout)
                    room.timerTimeout = setTimeout(async () => {
                        if (room.submissionState === 'inGame') {
                            const error = await verifyCode(room)
                            if (error) {
                                room.submissionState = 'timedOut'
                            } else {
                                room.error = null
                                room.submissionState = 'timedOutCorrect'
                            }

                            broadcastRoomState(room)
                            loadQuestion(room)
                        }
                    }, timer)
                    broadcastRoomState(room)
                }
            } catch (error) {
                console.error(error)
            }
        },
        onClose: (_event, ws) => {
            try {
                wsById[id] = ws
                console.log('Connection closed')
                leaveRoom(id)
                delete wsById[id]
            } catch (error) {
                console.error(error)
            }
        },
    }
}))

export default {
    fetch: app.fetch,
    websocket,
}
