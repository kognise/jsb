import ReconnectingWebSocket from 'https://esm.sh/@opensumi/reconnecting-websocket@4.4.0'
import { h, render } from 'https://esm.sh/preact@10.27.2'
import { useState, useEffect, useRef } from 'https://esm.sh/preact@10.27.2/hooks'
import htm from 'https://esm.sh/htm@3.1.1'
import confetti from 'https://esm.sh/canvas-confetti@1.9.4'
import { Keyboard, allCharacters } from './keyboard.js'

const html = htm.bind(h)
let lang = (() => {
    const params = new URLSearchParams(window.location.search)
    const langParam = params.get('lang')
    if (langParam !== null) {
        return langParam
    }
    return window.location.host.startsWith('py') ? 'py' : 'js'
})()
const fullLang = lang === 'js' ? 'JavaScript' : 'Python'

// Set theme
document.documentElement.style.setProperty('--theme', `var(--theme-${lang})`)
document.documentElement.style.setProperty('--theme-darker', `var(--theme-${lang}-darker)`)

// Render SEO metadata
const canonical = `https://${lang}b.ee/`
const description = `The ${fullLang} game with a twist: you have 3 minutes to solve a challenge with your friends, but you only get one character at a time. Can you write working code before the time runs out?`
render(html`
    <title>${lang}bee</title>
    <link rel='icon' href='/bees/icon-${lang}.png' />
    <link rel='canonical' href=${canonical} />
    <meta name='description' content=${description} />
    <meta property='og:description' content=${description} />
    <meta property='og:title' content='${lang}bee' />
    <meta property='og:type' content='website' />
    <meta property='og:url' content=${canonical} />
`, document.head)

const link = document.createElement('link')
link.rel = 'stylesheet'
console.log(allCharacters.join(''))
link.href = 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz@0,14..32;1,14..32&display=swap&text=' + encodeURIComponent(allCharacters.join(''))
document.head.appendChild(link)

// Start everything else!
const ws = new ReconnectingWebSocket('/ws')

const seen = new Set()
for (const item of JSON.parse(localStorage.getItem('seen') ?? '[]')) {
    if (item) seen.add(item)
}

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

const beeSpeed = 0.15
const deltaTime = 60
const safeArea = 80
const safeTime = 1000
const bees = [ 'dead', 'flying', 'idle' ]
const initialPosition = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
}
function Bee({ pos, setPos }) {
    const goal = useRef(initialPosition)
    const leftSafeAreaAt = useRef(Date.now() - safeTime)
    const [ dir, setDir ] = useState('left') // left | right
    const [ isFlying, setIsFlying ] = useState(true)
    const [ isDead, setIsDead ] = useState(false)

    useEffect(() => {
        const onMove = (event) => {
            if (event.target?.classList.contains('jsbee') || event.target?.classList.contains('pybee')) {
                goal.current = {
                    x: event.target.offsetLeft + 10,
                    y: event.target.offsetTop - 35,
                    isDead: true,
                }
            } else {
                goal.current = { x: event.clientX, y: event.clientY }
            }
        }

        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setPos((pos) => {
                const diff = {
                    x: goal.current.x - pos.x,
                    y: goal.current.y - pos.y,
                }
                const dist = Math.hypot(diff.x, diff.y)

                setIsDead(false)
                if (goal.current.isDead) {
                    if (diff.x === 0 && diff.y === 0) {
                        setIsDead(true)
                        return pos
                    }
                } else {
                    // Inside safe area
                    if (dist <= safeArea) {
                        leftSafeAreaAt.current = null
                        setIsFlying(false)
                        return pos
                    }

                    // Outside safe area
                    if (!leftSafeAreaAt.current) {
                        // Just left the safe area
                        leftSafeAreaAt.current = Date.now()
                    }
                    if (Date.now() - leftSafeAreaAt.current <= safeTime) {
                        // Still within grace period
                        setIsFlying(false)
                        return pos
                    }

                    // Safe time expired — fly!
                }

                if (dist > 0) {
                    const step = Math.min(dist, beeSpeed * deltaTime)

                    if (diff.x > 0) {
                        setDir('right')
                    } else if (diff.x < 0) {
                        setDir('left')
                    }
                    setIsFlying(diff.y < 0)

                    return {
                        x: pos.x + (diff.x / dist) * step,
                        y: pos.y + (diff.y / dist) * step,
                    }
                } else {
                    return pos
                }
            })
        }, deltaTime)

        return () => clearInterval(interval)
    }, [])

    const whichBee = isDead ? 'dead' : isFlying ? 'flying' : 'idle'
    return bees.map((bee) => html`
        <img
            key=${bee}
            alt=''
            class='bee'
            src=${`/bees/${bee}.gif`}
            width=${30}
            style=${bee === whichBee
                ? {
                    transform: dir === 'left'
                        ? isDead ? 'scale(1.5)' : ''
                        : isDead ? 'scaleX(-1.5) scaleY(1.5)' : 'scaleX(-1)',
                    filter: lang === 'py' ? 'hue-rotate(175deg)' : '',
                    top: `${pos.y}px`,
                    left: `${pos.x}px`,
                }
                : { display: 'none' }}
        />
    `)
}

function DisableScroll() {
    return html`<style>body { overflow: hidden; }</style>`
}

function App() {
    // hoisted to preserve bee state across state changes
    const [ beePos, setBeePos ] = useState(initialPosition)

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
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                ws.send(JSON.stringify({ kind: 'submit' }))
                return
            }

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
            <${Bee} pos=${beePos} setPos=${setBeePos} />
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
                        <h1>Start or join a <span class='brand'>jsbee</span> game</h1>
                        <p>or <a href='${window.location.protocol}//${window.location.host.replace('js', 'py')}/' class='pybee'>play pybee</a> instead</p>
                    `
                    : html`
                        <h1>Start or join a <span class='brand'>pybee</span> game</h1>
                        <p>or <a href='${window.location.protocol}//${window.location.host.replace('py', 'js')}/' class='jsbee'>play jsbee</a> instead</p>
                    `}
                <p>
                    You and N friends (N >= 0) have 3 minutes to write a simple ${fullLang} function, but there's a twist: you alternate typing one character at a time, and you can't see what you've written until you submit the code... or run out of time.
                </p>
                <label for='room-code'>New or existing game code:</label>
                <input
                    id='room-code'
                    type='text'
                    value=${roomCode}
                    disabled=${isConnecting}
                    onInput=${(event) => setRoomCode(event.target.value)}
                    autoFocus
                />
                <button type='submit' disabled=${isConnecting}>Start or join</button>
            </form>
        `
    }

    if (gameState.submissionState === 'notStarted') {
        return html`
            <${Bee} pos=${beePos} setPos=${setBeePos} />
            <form class='game-status' onSubmit=${(event) => {
                event.preventDefault()
                ws.send(JSON.stringify({
                    kind: 'play',
                    mode: document.getElementById('mode-normal').checked ? 'normal' : 'competitive',
                }))
            }}>
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
                            <p class='description'>Whoever submits the code wins. Fight if you know how.</p>
                        </div>
                    </label>
                </div>

                <button type='submit'>
                    Start game
                </button>
            </form>
        `
    }

    if (gameState.submissionState === 'submitting') {
        return html`
            <${Bee} pos=${beePos} setPos=${setBeePos} />
            <div class='game-status'>
                <h1>Checking your code...</h1>
            </div>
        `
    }

    if (gameState.submissionState === 'correct') {
        if (gameState.mode === 'competitive') {
            if (gameState.submittingPlayer === gameState.yourPlayer) {
                return html`
                    <${Bee} pos=${beePos} setPos=${setBeePos} />
                    <div class='game-status'>
                        <h1>You won!!!</h1>
                        <p>The code works and YOU were the one to slam on the submit button.</p>
                        <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                            Play a new challenge
                        </button>
                    </div>
                `
            } else {
                return html`
                    <${Bee} pos=${beePos} setPos=${setBeePos} />
                    <div class='game-status'>
                        <h1>Your friends are better than you</h1>
                        <p>The code's right, at least! But someone else pressed submit.</p>
                        <button onClick=${() => { ws.send(JSON.stringify({ kind: 'play' })) }}>
                            Play a new challenge
                        </button>
                    </div>
                `
            }
        } else {
            return html`
                <${Bee} pos=${beePos} setPos=${setBeePos} />
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
            <${Bee} pos=${beePos} setPos=${setBeePos} />
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
            <${Bee} pos=${beePos} setPos=${setBeePos} />
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
            <${Bee} pos=${beePos} setPos=${setBeePos} />
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
    const minutes = Math.max(0, Math.floor(remainingMs / 1000 / 60))
    const seconds = Math.max(0, Math.floor(remainingMs / 1000) % 60)

    return html`
        <div class='game'>
            <${DisableScroll} />
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
            <${Keyboard} onKey=${(c) => {
                ws.send(JSON.stringify({ kind: 'letter', letter: c }))
            }} />
        </div>
    `
}

render(h(App), document.body)
