import SimpleKeyboard from 'https://esm.sh/react-simple-keyboard@3.8.88?alias=react:preact/compat,react-dom:preact/compat&deps=preact@10.27.2'
import { h } from 'https://esm.sh/preact@10.27.2'
import { useState } from 'https://esm.sh/preact@10.27.2/hooks'
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(h)

const layout = {
    default: [
        'q w e r t y u i o p',
        '{tab} a s d f g h j k l',
        '{shift} z x c v b n m , .',
        '{alt} {space} {enter}'
    ],
    shift: [
        'Q W E R T Y U I O P',
        '{tab} A S D F G H J K L',
        '{shiftactivated} Z X C V B N M , .',
        '{alt} {space} {enter}'
    ],
    alt: [
        '1 2 3 4 5 6 7 8 9 0',
        '\` @ # $ ^ & | = ( ) [ ]',
        '% - + * / ; : ! ? < > { }',
        '{default} {space} \' " {enter}'
    ],
}

// https://gchq.github.io/CyberChef/#recipe=URL_Encode(true)&input=cXdlcnR5dWlvcGFzZGZnaGprbHp4Y3Zibm0sLlFXRVJUWVVJT1BBU0RGR0hKS0xaWENWQk5NMTIzNDU2Nzg5MGBAIyQmKigpW117fTw%2BJS0rPS87OiE/JyJefOKHp%2BKshuKPjuKHpg&oenc=65001

const display = {
    '{alt}': '.?123',
    '{shift}': '⇧',
    '{shiftactivated}': '⬆',
    '{enter}': '⏎',
    '{space}': ' ',
    '{default}': 'ABC',
    '{back}': '⇦'
}

export function Keyboard(props) {
    const [ layoutName, setLayoutName ] = useState('default')

    function handleLayoutChange(button) {
        let newLayoutName = null

        switch (button) {
            case '{shift}':
            case '{shiftactivated}':
            case '{default}':
                newLayoutName = layoutName === 'default' ? 'shift' : 'default'
                break

            case '{alt}':
                newLayoutName = layoutName === 'alt' ? 'default' : 'alt'
                break

            default:
                break
        }

        if (newLayoutName) setLayoutName(newLayoutName)
    }

    return html`
        <div class='keyboard'>
            <${SimpleKeyboard}
                layoutName=${layoutName}
                mergeDisplay
                display=${display}
                layout=${layout}
                onChange=${(text) => {
                    props.onChar?.(text[text.length - 1])
                }}
                onKeyPress=${(button) => {
                    if (button.includes('{') && button.includes('}')) {
                        handleLayoutChange(button)
                    }
                    if (button === '{enter}') props.onChar?.('\n')
                }}
            />
        </div>
    `
}
