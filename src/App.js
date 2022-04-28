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
	const [tab, setTab]             = useState(1);
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
        setError("Connection with the server app lost. Check your connection and see if the server app is open, then try refreshing the page.")
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
