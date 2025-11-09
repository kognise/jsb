import ReconnectingWebSocket from 'https://esm.sh/@opensumi/reconnecting-websocket'
import { h, render } from 'https://esm.sh/preact'
import { useState, useEffect } from 'https://esm.sh/preact/hooks'
import htm from 'https://esm.sh/htm'
import confetti from 'https://esm.sh/canvas-confetti'

const lang = window.location.host === 'pybee.kognise.dev' ? 'py' : 'js'

document.documentElement.style.setProperty('--theme', `var(--theme-${lang})`)
document.documentElement.style.setProperty('--theme-darker', `var(--theme-${lang}-darker)`)

const html = htm.bind(h)

const ws = new ReconnectingWebSocket('/ws')

const seen = new Set()
for (const item in JSON.parse(localStorage.getItem('seen'))) {
    if (item) seen.add(item)
}

function writeSeen() {
    console.log('writing seen', seen, [ ...seen ])
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
    const [ isAnimating, setIsAnimating ] = useState(false)
    const [ _, _render ] = useState(null)

    useEffect(() => {
        function onMessage(event) {
            const json = JSON.parse(event.data)

            if (json.kind === 'gameState') {
                setIsConnecting(false)
                setGameState((gameState) => {
                    const prevState = gameState?.submissionState
                    const thisState = json.gameState?.submissionState

                    if (thisState !== prevState) {
                        if (thisState === 'correct' || thisState === 'timedOutCorrect') {
                            if (gameState?.mode === 'competitive') {
                                if (gameState?.submittingPlayer === gameState?.yourPlayer) {
                                    doConfetti()
                                }
                            } else {
                                doConfetti()
                            }
                        }

                        if (thisState === 'correct' || thisState === 'incorrect' || thisState === 'timedOut' || thisState === 'timedOutCorrect') {
                            seen.add(json.gameState.question)
                            writeSeen()
                        }

                        if (thisState === 'inGame') {
                            setTimeout(() => setIsAnimating(true), 200)
                        } else {
                            setIsAnimating(false)
                        }
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
                if (roomCode.length === 0) return
                setIsConnecting(true)
                ws.send(JSON.stringify({
                    kind: 'joinRoom',
                    password: roomCode,
                    seen: [ ...seen ],
                    lang,
                }))
            }}>
                ${lang === 'js'
                    ? html`
                        <h1>Join or start a <span class='brand'>jsbee</span> game</h1>
                        <p>or <a href='https://pybee.kognise.dev/' class='pybee'>play pybee</a> instead</p>
                    `
                    : html`
                        <h1>Join or start a <span class='brand'>pybee</span> game</h1>
                        <p>or <a href='https://jsbee.kognise.dev/' class='jsbee'>play jsbee</a> instead</p>
                    `}
                <p>
                    You and N friends (N >= 0) have 3 minutes to write a simple function, but there's a twist: you alternate typing one character at a time, and you can't see what you've written until you submit the code... or run out of time.
                </p>
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
                <h1>Ready up</h1>
                <p>Start the game as soon as everyone has joined.</p>
                <p>Player count: ${gameState.playerCount}</p>
                <div class='mode-selector'>
                    <label>
                        <input id='mode-normal' type='radio' name='mode' value='normal' checked=true />
                        <div>
                            <p class='title'>Normal mode</p>
                            <p class='description'>Work together to solve the challenge before time runs out.</p>
                        </div>
                    </label>
                    <label>
                        <input id='mode-competitive' type='radio' name='mode' value='competitive' />
                        <div>
                            <p class='title'>Competitive mode</p>
                            <p class='description'>Whoever typed the last character wins.</p>
                        </div>
                    </label>
                </div>

                <div class='button-group'>
                    <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play', mode: document.getElementById('mode-normal').checked ? 'normal' : 'competitive' })) }}>
                        Start game
                    </button>
                </div>
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
        if (gameState.mode === 'competitive') {
            if (gameState.submittingPlayer === gameState.yourPlayer) {
                return html`
                    <div class='game-status'>
                        <h1>You won!</h1>
                        <p>You finished the code, and it did the right thing!</p>
                        <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                            Play a new challenge
                        </button>
                    </div>
                `
            } else {
                return html`
                    <div class='game-status'>
                        <h1>You didn't finish the code :(</h1>
                        <p>The code is correct, but someone else typed the last character...</p>
                        <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                            Play a new challenge
                        </button>
                    </div>
                `
            }
        } else {
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
    }

    if (gameState.submissionState === 'timedOutCorrect') {
        return html`
            <div class='game-status'>
                <h1>Somehow, you scraped by</h1>
                <p>You ran out of time, but your code was right! You'll get the pass this time...</p>
                <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                    Play again!
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
                        ${isAnimating ? 'animate' : ''}
                    ' key=${i}>
                        ${gameState.lastLetter?.player === i && formatLetter(gameState.lastLetter.letter)}
                        ${gameState.yourPlayer === i && html`<div class='you'>You</div>`}

                        <div class='fg'>
                            ${gameState.lastLetter?.player === i && formatLetter(gameState.lastLetter.letter)}
                            ${gameState.yourPlayer === i && html`<div class='you'>You</div>`}
                            ${gameState.currentPlayer === i && html`<div class='cursor'></div>`}
                        </div>

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
