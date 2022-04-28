import { useEffect, useRef, useState } from "react";
import { time } from "../server/Server";
import { HIGHLIGHT_COLOR } from "./colors";




function setBgColor(elem, color, ocolor) {
    elem.style.backgroundColor = color;
}


export default function MouseUI({ listener }) {

    const [holding, setHolding] = useState(false);
    const [LMB, setLMB]         = useState(null);
    const [RMB, setRMB]         = useState(null);
    const mousePos              = useRef();
    const touchStartTime        = useRef(0);

    useEffect(() => {

        if (typeof LMB != 'boolean') return;

        // if( LMB )
        // {
        //     // var interval = setTimeout(()=>{

        //     //     listener({ type:"HoldLMB" })
        //     //     setHolding(true);
        //     // }, 200);
        //     setHolding(true);
        // } 
        // else 
        // {
        //     if( holding )
        //     {
        //         setHolding(false); 
        //         return;
        //     }   
        // } 

        setHolding(LMB);

        listener({ type: "LMB", bool: LMB })

        // ()=>interval && clearInterval(interval) 

    }, [LMB])

    useEffect(() => {

        if (typeof RMB != 'boolean') return;
        listener({ type: "RMB", bool: RMB })

    }, [RMB])


    const onClickCenterMouse = ()=>{
        listener({ type: `center:mouse` })
    }

    const _handleMouseMove = (eventName, colorOFF, ev, resetMousePos) => {
        const touch = ev.touches[0];

        switch (ev.type) {
            case "touchstart":
                setBgColor(ev.target, HIGHLIGHT_COLOR)
                mousePos.current = [touch.clientX, touch.clientY]

                listener({ type: `${eventName}:start` })

                touchStartTime.current = time();
                break;

            case "touchend":
                setBgColor(ev.target, colorOFF)
                listener({ type: `${eventName}:end` })

                if (!holding && touchStartTime.current > 0) {
                    // var t = time();
                    // var diff = t - touchStartTime.current;

                    // if (diff < 100) {
                    //     //listener({ type: "LMB", bool: true });
                    //     //listener({ type: "LMB", bool: false });
                    //     listener({ type:"click" })
                    // }

                    listener({ type:"click" })
                }
                break;

            case "touchmove":

                touchStartTime.current = 0;

                var x = Math.round(touch.clientX - mousePos.current[0]);
                var y = Math.round(touch.clientY - mousePos.current[1]);

                listener({ type: eventName, dx: x, dy: y }) //<-- amount es una cantidad de pixeles relativa al punto de inicio

                if (resetMousePos)
                    mousePos.current = [touch.clientX, touch.clientY]

        }
    }

    const handleDrag = ev => {
        _handleMouseMove("scroll", "white", ev);
    }

    const handleMove = ev => {
        _handleMouseMove("move", "inherit", ev, true);
    }


    return <div style={{ height: "100%", padding: 30, boxSizing: "border-box", position: "relative" }}>

        <svg onClick={onClickCenterMouse} xmlns="http://www.w3.org/2000/svg" style={{ position:"fixed", bottom:20, right:20, fill:"white" }} height="48" width="48"><path d="M22.5 45.9V42.15Q15.65 41.45 11.1 36.9Q6.55 32.35 5.85 25.5H2.1V22.5H5.85Q6.55 15.65 11.1 11.1Q15.65 6.55 22.5 5.85V2.1H25.5V5.85Q32.35 6.55 36.9 11.1Q41.45 15.65 42.15 22.5H45.9V25.5H42.15Q41.45 32.35 36.9 36.9Q32.35 41.45 25.5 42.15V45.9ZM24 39.2Q30.25 39.2 34.725 34.725Q39.2 30.25 39.2 24Q39.2 17.75 34.725 13.275Q30.25 8.8 24 8.8Q17.75 8.8 13.275 13.275Q8.8 17.75 8.8 24Q8.8 30.25 13.275 34.725Q17.75 39.2 24 39.2ZM24 31.5Q20.85 31.5 18.675 29.325Q16.5 27.15 16.5 24Q16.5 20.85 18.675 18.675Q20.85 16.5 24 16.5Q27.15 16.5 29.325 18.675Q31.5 20.85 31.5 24Q31.5 27.15 29.325 29.325Q27.15 31.5 24 31.5ZM24 28.5Q25.9 28.5 27.2 27.2Q28.5 25.9 28.5 24Q28.5 22.1 27.2 20.8Q25.9 19.5 24 19.5Q22.1 19.5 20.8 20.8Q19.5 22.1 19.5 24Q19.5 25.9 20.8 27.2Q22.1 28.5 24 28.5ZM24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Z" /></svg>

        <div style={{
            border: "30px solid white",
            borderRadius: 180,
            boxSizing: "border-box",
            height: "100%",
            position: "relative",
            margin: 0
        }}>
            <div style={{
                display: "block",
                width: "100%",
                height: "30%",
                borderBottom: "4px solid white"
            }}>
                <div style={{
                    backgroundColor: "white",
                    width: "4px",
                    height: "30%",
                    position: "absolute",
                    top: "0px",
                    left: "50%",
                    marginLeft: "-2px",
                }}></div>

                <div style={{
                    backgroundColor: "white",
                    width: "16%",
                    height: "30%",
                    position: "absolute",
                    top: "10%",
                    left: "50%",
                    marginLeft: "-8%",
                    borderRadius: 180
                }}
                    // onTouchStart={ ev=>setBgColor( ev.target, HIGHLIGHT_COLOR ) }
                    // onTouchEnd={ ev=>setBgColor( ev.target, "white" ) }
                    onTouchStart={handleDrag}
                    onTouchEnd={handleDrag}
                    onTouchMove={handleDrag}
                    className="main-menu-btn"
                ></div>


                <div style={{
                    width: "50%",
                    height: "100%",
                    borderRadius: "200px 0px 0px 0px",
                    display: "inline-block",
                    backgroundColor: LMB ? HIGHLIGHT_COLOR : "inherit"
                }}
                    onTouchStart={ev => setLMB(!holding)}
                    onTouchEnd={ev => !holding && setLMB(false)}
                    className="main-menu-btn"
                ></div>

                <div style={{
                    width: "50%",
                    height: "100%",
                    borderRadius: "0px 200px 0px 0px",
                    display: "inline-block",
                    backgroundColor: RMB ? HIGHLIGHT_COLOR : "inherit"
                }}
                    onTouchStart={ev => setRMB(true)}
                    onTouchEnd={ev => setRMB(false)}
                    className="main-menu-btn"
                ></div>
            </div>

            <div style={{ width: "100%", backgroundColor: "inherit", height: "70%", borderRadius: "0 0 180px 180px" }}
                onTouchStart={handleMove}
                onTouchEnd={handleMove}
                onTouchMove={handleMove}
                className="main-menu-btn"
            >

            </div>
        </div>
    </div>
}