import { createContext, useContext, useRef } from "react";
import { HIGHLIGHT_COLOR } from "./colors";


/**
 * @type {(code:string, isDown:boolean)=>void}
 */
const KeyboardListenerContext = createContext();


/**
 * @typedef MyProps
 * @property {()=>void} onClose
 * @property {(code:string, isDown:boolean)=>void} onKeyPress
 * @property {(text:string)=>void} onTypedText
 * 
 * @param {MyProps} param0 
 * @returns 
 */
export default function KeyboardUI({
    onClose,
    onKeyPress,
    onTypedText,
    layout
}) {

    const inputRef = useRef();
    var ignoreNextKey;

    const onButtonPressed = (key, isDown) => {

        if (key == 'return' && inputRef.current.value) {
            onTypedText(inputRef.current.value)

            ignoreNextKey = "return";
            inputRef.current.value = "";
            inputRef.current.blur();
            return;
        }

        if (key == ignoreNextKey) {
            ignoreNextKey = null;
            return;
        }

        onKeyPress(key, isDown);

    }

    return <KeyboardListenerContext.Provider value={onButtonPressed}>
        <div style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center"
        }}
        >
            {/* <svg
                width="70"
                height="70"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "white", position: "absolute", top: 0, right: 0 }}
                xmlns="http://www.w3.org/2000/svg"
                onClick={onClose}
            >
                <path
                    d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                    fill="currentColor"
                />
            </svg> */}

            <div style={{ padding: 10, width: "100%", boxSizing: "border-box" }}>



                {layout == 1 && <>

                    <div class="grid-row mb20 tsizex2">
                        <Button code="volumedown" radius={90}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M9.15 26.35V21.65H38.85V26.35Z" /></svg>
                        </Button>
                        <Button code="volumemute" radius={90}>
                            <svg style={{ pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M41.05 46.4 34.35 39.65Q33.1 40.5 31.65 41.125Q30.2 41.75 28.6 42.1V38.35Q29.4 38.1 30.225 37.8Q31.05 37.5 31.75 36.95L24.6 29.65V43.05L12.85 31.25H4.1V16.7H11.95L1.2 5.7L3.7 3.2L43.6 43.8ZM40.2 34 37.65 31.35Q38.65 29.7 39.125 27.825Q39.6 25.95 39.6 23.95Q39.6 18.8 36.55 14.75Q33.5 10.7 28.6 9.55V5.8Q35 7.25 39.1 12.325Q43.2 17.4 43.2 23.95Q43.2 26.65 42.425 29.2Q41.65 31.75 40.2 34ZM18.3 23.2ZM33.55 27.25 28.6 22.2V15.45Q31.1 16.65 32.65 18.95Q34.2 21.25 34.2 24Q34.2 24.85 34.025 25.675Q33.85 26.5 33.55 27.25ZM24.6 18.1 18.1 11.45 24.6 4.95ZM19.85 31.6V24.8L16.55 21.45H8.8V26.55H14.8Z" /></svg>
                        </Button>
                        <Button code="volumeup" radius={90}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M21.65 38.85V26.35H9.15V21.65H21.65V9.15H26.35V21.65H38.85V26.35H26.35V38.85Z" /></svg>
                        </Button>
                    </div> 

                    <div class="grid-row tsizex2">
                        <div><Button code="esc" >ESC</Button></div>
                        <Button code="up" radius={15}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M14.15 30.75 12 28.6 24 16.6 36 28.55 33.85 30.7 24 20.85Z" /></svg>
                        </Button>
                        <div><Button code="del" >DEL</Button></div>
                    </div>
                    <div class="grid-row tsizex2">
                        <Button code="left" radius={15}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M28.05 36 16 23.95 28.05 11.9 30.2 14.05 20.3 23.95 30.2 33.85Z" /></svg>
                        </Button>
                        <Button code="down" radius={15}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M24 30.8 12 18.8 14.15 16.65 24 26.5 33.85 16.65 36 18.8Z" /></svg>
                        </Button>
                        <Button code="right" radius={15}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M18.75 36 16.6 33.85 26.5 23.95 16.6 14.05 18.75 11.9 30.8 23.95Z" /></svg>
                        </Button>
                    </div>
                </>}

                {layout == 2 && <>
                    <input
                        type="text"
                        style={{
                            fontSize: "2em",
                            width: "100%",
                            height: "8vh",
                            boxSizing: "border-box",
                            padding: 10,
                            color:"blue",
                            display: "inline-block",
                            borderRadius:90
                        }}
                        placeholder="type here..."

                        ref={inputRef}
                    />

                    <div class="grid-row mt10">
                        <Button code="backspace">← BACKSPACE</Button> 
                        <Button code="return">
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M6 40V8L44 24ZM9 35.35 36.2 24 9 12.5V20.9L21.1 24L9 27ZM9 35.35V24V12.5V20.9V27Z"/></svg>
                        </Button>
                    </div>

                    <div class="grid-row mt10"> 
                        <Button code="space" style={{ flexGrow: 2 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M8 25.5V22.5H40V25.5Z"/></svg>
                        </Button> 
                    </div>
                </>}



            </div>
        </div></KeyboardListenerContext.Provider>;
}


const Button = ({ children, code, style, radius = 4 }) => {

    const onKey = useContext(KeyboardListenerContext);

    return <div style={{
        height: "10vh", margin:3, display: "flex", flexGrow: 1, alignItems: "center", fill:"white", color:"white", justifyContent: "center", background: "inherit", border: "5px solid rgba(255,255,255,0.5)",
        borderRadius: radius
        , ...style
    }}
        onTouchStart={ev => (ev.target.style.backgroundColor = HIGHLIGHT_COLOR) && onKey(code, true)}
        onTouchEnd={ev => (ev.target.style.backgroundColor = "inherit") && onKey(code, false)}
        className="main-menu-btn"
    >

        {children}
    </div>
}