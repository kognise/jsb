import { h, render } from 'https://esm.sh/preact@10.27.2'
import { useState, useCallback, useRef } from 'https://esm.sh/preact@10.27.2/hooks'
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(h)

const layouts = {
    default: [
        'q w e r t y u i o p',
        'tab a s d f g h j k l',
        'shift z x c v b n m , .',
        'alt space enter'
    ],
    alt: [
        '1 2 3 4 5 6 7 8 9 0',
        '\` @ # $ ^ & | = ( ) [ ]',
        '% - + * / ; : ! ? < > { }',
        'default space \' " enter'
    ],
}

const display = {
    alt: '.?123',
    default: 'ABC',
    shift: '⇧',
    shiftActivated: '⬆',
    enter: '⏎',
    tab: 'tab',
    space: ' ',
}

export const allCharacters = [
    ...new Set(Object.values(layouts).flatMap(
        (layout) => layout.flatMap(
            (row) => row.split(' ').map(
                (key) => key.length > 1 ? display[key] : key
            )
        )
    ))
]

function Key(props) {
    const isSpecial = props.value.length > 1

    const valueDisplay = isSpecial
        ? display[props.isShift && props.value === 'shift' ? 'shiftActivated' : props.value]
        : props.isShift ? props.value.toUpperCase() : props.value

    return html`
        <div
            class='
                key
                ${isSpecial ? `key-${props.value}` : ''}
                ${props.isActive ? 'is-active' : ''}
                ${/^[A-Z]$/.test(valueDisplay) ? 'is-uppercase-letter' : ''}
            '
            onContextMenu=${(event) => event.preventDefault()}
            data-key=${props.value}
        >
            <div class='inner'>
                <div class='display'>
                    ${valueDisplay}
                </div>
                ${props.isActive && !isSpecial && props.value !== ' ' && html`
                    <div class='preview'>
                        <div class='display'>
                            ${valueDisplay}
                        </div>
                    </div>
                `}
            </div>
        </div>
    `
}

function findKey(event, keyboardRef) {
    let element = document.elementFromPoint(event.clientX, event.clientY)
    while (element && element !== keyboardRef.current && !element.dataset.key) {
        element = element.parentElement
    }
    return element?.dataset.key ?? null
}

function haptic() {
    if ('vibrate' in navigator) navigator.vibrate(2)
}

export function Keyboard(props) {
    const [ isShift, setIsShift ] = useState(false)
    const [ layoutName, setLayoutName ] = useState('default')
    const [ activeKey, setActiveKey ] = useState('y')
    const [ pointerDownTime, setPointerDownTime ] = useState(0)
    const keyboardRef = useRef(null)

    const onKey = useCallback(() => {
        if (!activeKey) return

        if (Date.now() - pointerDownTime > 500) haptic()

        switch (activeKey) {
            case 'alt':
                setLayoutName('alt')
                break
            case 'default':
                setLayoutName('default')
                break
            case 'shift':
                setIsShift(!isShift)
                break
            case 'enter':
                props.onKey?.('\n')
                break
            case 'tab':
                props.onKey?.('\t')
                break
            case 'space':
                props.onKey?.(' ')
                break
            default:
                if (activeKey.length === 1) {
                    props.onKey?.(isShift ? activeKey.toUpperCase() : activeKey)
                }
        }
    }, [ activeKey, props.onKey, isShift ])

    const layout = layouts[layoutName]

    return html`
        <div
            class='keyboard'
            ref=${keyboardRef}
            onPointerDown=${(event) => {
                keyboardRef.current.setPointerCapture(event.pointerId)
                setPointerDownTime(Date.now())
                const key = findKey(event, keyboardRef)
                setActiveKey(key)
                if (key) haptic()
            }}
            onPointerUp=${(event) => {
                keyboardRef.current.releasePointerCapture(event.pointerId)
                onKey()
                setActiveKey(null)
            }}
            onPointerMove=${(event) => {
                setActiveKey(findKey(event, keyboardRef))
            }}
        >
            ${layout.map((row) => html`
                <div class='row' key=${row}>
                    ${row.split(' ').map((key) => html`
                        <${Key}
                            key=${key}
                            value=${key}
                            isShift=${isShift}
                            setIsShift=${setIsShift}
                            setLayoutName=${setLayoutName}
                            isActive=${activeKey === key}
                        />
                    `)}
                </div>
            `)}
        </div>
    `
}

render(h(Keyboard), document.body)
