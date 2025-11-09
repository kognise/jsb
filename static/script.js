import ReconnectingWebSocket from 'https://esm.sh/@opensumi/reconnecting-websocket'
import { h, render } from 'https://esm.sh/preact'
import { useState, useEffect } from 'https://esm.sh/preact/hooks'
import htm from 'https://esm.sh/htm'
import confetti from 'https://esm.sh/canvas-confetti'

const html = htm.bind(h)

const ws = new ReconnectingWebSocket('/ws')

const seen = new Set(JSON.parse(localStorage.getItem('seen')))

function writeSeen() {
    localStorage.setItem('seen', JSON.stringify([ ...seen ]))
}

ws.addEventListener('close', (event) => {
    console.warn('websocket connection lost', event)
})

setInterval(() => {
    ws.send(JSON.stringify({ kind: 'heartbeat' }))
}, 1000)

function formatLetter(letter) {
    if (letter === '\t') {
        return '⇨'
    } else if (letter === '\n') {
        return '⏎'
    } else if (letter === ' ') {
        return '␣'
    } else {
        return letter
    }
}

function doConfetti() {
    const end = Date.now() + 1000 * 2
    const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']

    ;(function frame() {
        confetti({
            particleCount: 10,
            angle: 60,
            spread: 55,
            startVelocity: 80,
            origin: { x: 0, y: 1 },
            colors: [ colors[Math.floor(Math.random() * colors.length)], colors[Math.floor(Math.random() * colors.length)] ],
            scalar: 1.2,
        })
        confetti({
            particleCount: 10,
            angle: 120,
            spread: 55,
            startVelocity: 80,
            origin: { x: 1, y: 1 },
            colors: [ colors[Math.floor(Math.random() * colors.length)], colors[Math.floor(Math.random() * colors.length)] ],
            scalar: 1.2,
        })

        if (Date.now() < end) {
            requestAnimationFrame(frame)
        }
    }())
}

function App() {
    const [ roomCode, setRoomCode ] = useState('')
    const [ isConnecting, setIsConnecting ] = useState(false)
    const [ gameState, setGameState ] = useState(null)
    const [ _, _render ] = useState(null)

    useEffect(() => {
        function onMessage(event) {
            const json = JSON.parse(event.data)
            console.log(json)

            if (json.kind === 'gameState') {
                setIsConnecting(false)
                setGameState((gameState) => {
                    if (json.gameState?.submissionState === 'correct' && gameState?.submissionState !== 'correct') {
                        doConfetti()
                        seen.add(json.question)
                        writeSeen()
                    } else if (json.gameState?.submissionState === 'incorrect' && gameState?.submissionState !== 'incorrect') {
                        seen.add(json.question)
                        writeSeen()
                    } else if (json.gameState?.submissionState === 'timedOut' && gameState?.submissionState !== 'timedOut') {
                        seen.add(json.question)
                        writeSeen()
                    }
                    return json.gameState
                })
            }
        }

        ws.addEventListener('message', onMessage)
        return () => ws.removeEventListener('message', onMessage)
    }, [])

    useEffect(() => {
        if (gameState?.submissionState !== 'inGame') return

        const timer = setInterval(() => {
            _render({})
        }, 1000)

        const onDown = (event) => {
            if (event.altKey || event.metaKey || event.ctrlKey) return

            let letter = null
            if (event.key.length === 1) {
                letter = event.key
            } else if (event.key === 'Enter') {
                letter = '\n'
            } else if (event.key === 'Tab') {
                letter = '\t'
            }
            if (letter) {
                ws.send(JSON.stringify({ kind: 'letter', letter }))
                event.preventDefault()
            }
        }

        window.addEventListener('keydown', onDown)
        return () => {
            window.removeEventListener('keydown', onDown)
            clearInterval(timer)
        }
    }, [ gameState?.submissionState ])

    if (!gameState) {
        return html`
            <form class='join-container' onSubmit=${(event) => {
                event.preventDefault()
                setIsConnecting(true)
                ws.send(JSON.stringify({
                    kind: 'joinRoom',
                    password: roomCode,
                    seen: [ ...seen ],
                }))
            }}>
                <h1>Join or start a game</h1>
                <label for='room-code'>Game password:</label>
                <input
                    id='room-code'
                    type='text'
                    value=${roomCode}
                    disabled=${isConnecting}
                    onInput=${(event) => setRoomCode(event.target.value)}
                    autoFocus
                />
                <button type='submit' disabled=${isConnecting}>Join or start</button>
            </form>
        `
    }

    if (gameState.submissionState === 'notStarted') {
        return html`
            <div class='game-status'>
                <h1>Waiting for players</h1>
                <p>Start the game whenever you're ready.</p>
                <p>Player count: ${gameState.playerCount}</p>
                <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                    Start game
                </button>
            </div>
        `
    }

    if (gameState.submissionState === 'submitting') {
        return html`
            <div class='game-status'>
                <h1>Checking your code...</h1>
            </div>
        `
    }

    if (gameState.submissionState === 'correct') {
        return html`
            <div class='game-status'>
                <h1>alert('Good job!')</h1>
                <p>Your code did the right thing!</p>
                <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                    Play a new challenge
                </button>
                <pre>${h('code', null, gameState.fullString)}</pre>
            </div>
        `
    }

    if (gameState.submissionState === 'incorrect') {
        return html`
            <div class='game-status'>
                <h1>Failed tests :(</h1>
                <p>Looks like your code wasn't up to snuff. Better luck next time?!</p>
                <p>(${gameState.error})</p>
                <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                    Try a new challenge
                </button>
                <pre>${h('code', null, gameState.fullString)}</pre>
            </div>
        `
    }

    if (gameState.submissionState === 'timedOut') {
        return html`
            <div class='game-status'>
                <h1>Timer ran out</h1>
                <p>Aw, you took too long. Best go take some Adderall before the next round.</p>
                <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                    Try a new challenge
                </button>
                <pre>${h('code', null, gameState.fullString)}</pre>
            </div>
        `
    }

    const remainingMs = gameState.timerEnd - Date.now()
    const minutes = Math.floor(remainingMs / 1000 / 60)
    const seconds = Math.floor(remainingMs / 1000) % 60

    return html`
        <div class='game'>
            <div class='header'>
                <div class='question'>${gameState.question}</div>
                <div class='timer'>${minutes}:${seconds.toString().padStart(2, '0')}</div>
            </div>
            <div class='players'>
                ${new Array(gameState.playerCount).fill(null).map((_, i) => html`
                    <div class='
                        player
                        ${gameState.yourPlayer === i ? 'is-you' : ''}
                        ${gameState.currentPlayer === i ? 'is-current' : ''}
                    ' key=${i}>
                        ${gameState.lastLetter?.player === i && formatLetter(gameState.lastLetter.letter)}

                        ${gameState.yourPlayer === i && gameState.currentPlayer === i && html`
                            <button class='submit' onClick=${() => {
                                ws.send(JSON.stringify({ kind: 'submit' }))
                            }}>
                                Click to submit
                            </button>
                        `}
                    </div>
                `)}
            </div>
        </div>
    `
}

render(h(App), document.body)
