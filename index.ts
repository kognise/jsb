import { deepEquals, inspect, randomUUIDv7 } from 'bun'
import { Hono } from 'hono'
import { serveStatic, upgradeWebSocket, websocket } from 'hono/bun'
import type { WSContext } from 'hono/ws'
import { questions, type Question } from './questions'

const app = new Hono()

type ClientMessage =
    | { kind: 'joinRoom', password: string, seen: string[] }
    | { kind: 'letter', letter: string }
    | { kind: 'leaveRoom' }
    | { kind: 'heartbeat' }
    | { kind: 'submit' }
    | { kind: 'play' }

type ServerMessage =
    | {
        kind: 'gameState'
        gameState: ClientGameState | null // null if you're not in a room
    }

type WS = WSContext<unknown>

type SubmissionState = 'notStarted' | 'inGame' | 'submitting' | 'correct' | 'incorrect' | 'timedOut'

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
    fullString: string | null
    error: string | null
}

interface Room {
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
    error: string | null
    playersSeen: Record<string, Set<string>>
    previousQuestions: Set<string>
    timerTimeout: Timer | null
}

const rooms: Record<string, Room> = {}
const wsById: Record<string, WS> = {}

function findRoomFromWs(id: string): Room | null {
    for (const roomString in rooms) {
        const room = rooms[roomString]
        if (room?.playerSockets.includes(id)) {
            return room
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
        fullString: (room.submissionState === 'correct' || room.submissionState === 'incorrect' || room.submissionState === 'timedOut')
            ? room.fullString : null,
        error: room.error,
    }
}

function broadcastRoomState(room: Room) {
    console.log(room.fullString)
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
        delete rooms[room.password]
    } else {
        broadcastRoomState(room)
        send(id, { kind: 'gameState', gameState: null })
    }
}

function send(id: string, message: ServerMessage) {
    wsById[id]?.send(JSON.stringify(message))
}

async function loadQuestion(room: Room) {
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
    return await loadQuestion(room)
}

// Returns an error string if it failed
async function verifyCode(room: Room): Promise<string | null> {
    for (const testCase of room.question.testCases) {
        let result: unknown
        try {
            const func = new Function(room.fullString + '\n;return f')
            result = func()(...testCase.args)
        } catch (error) {
            return String(error)
        }
        if (!deepEquals(result, testCase.result)) {
            const called = 'f(' + testCase.args.map((arg) => inspect(arg, { compact: true })).join(', ') + ')'
            const expected = inspect(testCase.result, { compact: true })
            const actual = inspect(result, { compact: true })
            return `Incorrect result for ${called}. Expected: ${expected}, got: ${actual}`
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
            wsById[id] = ws

            if (!heartbeatTimeout) heartbeatTimeout = setTimeout(() => leaveRoom(id), 2000)

            const data: ClientMessage = JSON.parse(event.data.toString())

            if (data.kind === 'joinRoom') {
                let room: Room

                if (rooms[data.password]) {
                    room = rooms[data.password]!
                    room.playerSockets.push(id)
                    room.playersSeen[id] = new Set(data.seen)
                } else {
                    room = {
                        password: data.password,
                        question: null as any,
                        playerSockets: [ id ],
                        currentPlayer: 0,
                        lastLetter: null,
                        fullString: '',
                        submissionState: 'notStarted',
                        timerEnd: 0,
                        error: null,
                        previousQuestions: new Set(),
                        playersSeen: {
                            [id]: new Set(data.seen),
                        },
                        timerTimeout: null
                    }

                    await loadQuestion(room)

                    rooms[data.password] = room
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
                broadcastRoomState(room)
                void loadQuestion(room)
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

                const timer = 1000 * 60 * 3 // 3 minutes
                room.timerEnd = Date.now() + timer
                if (room.timerTimeout !== null) clearTimeout(room.timerTimeout)
                room.timerTimeout = setTimeout(() => {
                    if (room.submissionState === 'inGame') {
                        room.submissionState = 'timedOut'
                        broadcastRoomState(room)
                        void loadQuestion(room)
                    }
                }, timer)
                broadcastRoomState(room)
            }
        },
        onClose: (_event, ws) => {
            wsById[id] = ws
            console.log('Connection closed')
            leaveRoom(id)
            delete wsById[id]
        },
    }
}))

export default {
    fetch: app.fetch,
    websocket,
}
