//import logo from './logo.svg';
import { useEffect, useState } from "react";
import "./App.css";
import { Server } from "./server/Server";
import KeyboardUI from "./ui/KeyboardUI";
import MainMenu from "./ui/MainMenu";
import MouseUI from "./ui/MouseUI";
import Spinner from "./ui/Spinner";

/**
 * @type {Server}
 */
var server;
const HOST = "ws://" + (document.location.hostname || "localhost") + ":8000";

function App() {
	const [tab, setTab]             = useState(0);
    const [error, setError]         = useState();
    const [connected, setConnected] = useState(false);


    useEffect(()=>{

        if(!server) 
        {
            try 
            {
                server = new Server(HOST); 
            }
            catch(e)
            {
                console.log("SOCKET ERROR")
                setError( e.message )
            } 
        }

        server.ws.addEventListener("close", onServerError );
        server.ws.addEventListener("open", onServerConnected );

    }, []);


    const onServerError = ev => {
        setError("Oops! Something went wrong.")
    }

    const onServerConnected = ev => {
        setConnected(true);
    }

    const onMouseUIEvent = ({ type, bool, dx, dy }) => {
        
        switch( type )
        {
            case "center:mouse":
                server.centerMouse();
                break;

            case "click":
                server.click();
                break;

            case "LMB":
                if( bool )
                {
                    server.getMousePos(); 
                }
                server.holdMouse(bool);
                break;

            case "ReleaseLMB":
                server.holdMouse(false);
                break;

            case "RMB":
                if( bool ) server.rightclick();
                break;

            case "scroll":
                server.scroll(-dy);
                break;

            case "move:start":
                server.getMousePos();
                break;

            case "move": 
                server.move(dx,dy);
                break;
        }

    }

    const onKeyboardKeyPress = (code, isDown) => {
        server.sendKey(code, isDown)
    }

    const onSendText = txt => {

        console.log("TYPE TEXT", txt)
        server.sendText(txt)
    }
 

    if( error )
    {
        return <div className="error" onClick={()=>window.location.reload()}>

                <svg style={{ display:"block", marginBottom:20, fill:"red"}} xmlns="http://www.w3.org/2000/svg" height="48" width="80%"><path d="M28.3 8H39.8V11H33.25L34 11.7Q37 14.5 38.5 17.7Q40 20.9 40 23.85Q40 29.15 36.9 33.4Q33.8 37.65 28.7 39.25V36.1Q32.5 34.65 34.75 31.275Q37 27.9 37 23.85Q37 21.45 35.825 18.975Q34.65 16.5 32.75 14.6L31.3 13.3V19.5H28.3ZM19.85 40H8.35V37H14.85L14.1 36.4Q10.9 33.85 9.45 30.85Q8 27.85 8 24.15Q8 18.85 11.125 14.625Q14.25 10.4 19.35 8.8V11.9Q15.6 13.35 13.3 16.725Q11 20.1 11 24.15Q11 27.3 12.175 29.625Q13.35 31.95 15.35 33.65L16.85 34.7V28.5H19.85Z"/></svg>
                    {error}
                    <div style={{fontSize:"0.7em", marginTop:20}}>click to refresh the page</div>
                </div>
    }

    if( !connected )
    {
        return <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <Spinner/>
        </div>
    } 
    

	return (
		<div className="App"> 

            <MainMenu tab={tab} onClickOnTab={ setTab }/>

            <div style={{flexGrow:1,  flexDirection:"column"}}>
 

			{tab == 0 && ( 
					<MouseUI listener={ onMouseUIEvent } />
 
			)}

			{tab == 1 && (
				<KeyboardUI
					onClose={() => setTab(0)}
					onKeyPress={ onKeyboardKeyPress }
                    onTypedText={ onSendText }
                    layout={1}
				/>
			)}

            {tab == 2 && (
				<KeyboardUI
					onClose={() => setTab(0)}
					onKeyPress={ onKeyboardKeyPress }
                    onTypedText={ onSendText }
                    layout={2}
				/>
			)}
            </div>

            <div style={{ color:"#999", width:"100%", textAlign:"center"}}><sup>by</sup> Pablo Bandinopla <sup>2022.04.27</sup></div>
		</div>
	);
}

export default App;
