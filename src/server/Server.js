import { OPCodes } from "./opcodes";
import keycodes from "../pyautogui-keycodes.json"

export const time   = () => new Date().getTime(); 

/** 
 * @see https://pyautogui.readthedocs.io/en/latest/keyboard.html#keyboard-keys
 */
const keycodeIndex  = code => keycodes.indexOf(code);


export class Server {
    #_ws;
    #_idCount   = 0;
    #_pending   = false;
    #_locked    = new Set();
    #_ready     = false;

    #_offsetX;
    #_offsetY;

    /**
     * MOuse position on the PC
     * @type {{x:number, y:number}}
     */
    #_mousePosition;

    /**
     * @param {string} host - the URL of the web socket.
     */
    constructor(host) {
        if (!("WebSocket" in window)) {
            throw new Error(
                "This browser is not supported. Use a modern one like Chrome or Firefox!"
            );
        } 

        this.#_ws = new WebSocket(host);

        this.#_ws.addEventListener(
            "open",
            (ev) => (this.#_ready = true)
        );
        this.#_ws.addEventListener(
            "close",
            (ev) => (this.#_ready = false)
        );
    }

    /**
     * @return {WebSocket}
     */
    get ws() {
        return this.#_ws;
    } 

    /**
     * Send bytes to server. First byte is OPCode. 
     * 
     * @param {int|Array} what 
     * @param { (response:ArrayBuffer)=>void } callback The first byte is always OPCode <uint8>
     * @param { bool } lockUntilResponded Only one call of this OPCode is allowed until the server responds the opcode back.
     */
    async #_sendBytes( opcode, what, callback, lockUntilResponded = false ) {
 
        //
        // ignore if we are waiting for the response of a previous opcode call...
        //
         
        if( !this.#_ready || (lockUntilResponded && this.#_locked.has(opcode)) )
        { 
            return;
        }

        var payload = [
            Uint8Array.of( opcode ) // first byte is the opcode
        ]; 

        if( what instanceof Array ) // OPCode
        { 
            payload = [
                ...payload,
                ...what
            ]
        }
        else
        {
            what && payload.push( what )
            //payload = await new Blob( what ).arrayBuffer() 
        } 

        if( lockUntilResponded )
        {
            this.#_locked.add( opcode )

            if( !callback )
            {
                callback = true;
            }
        }

        //
        // if we have a callback it means we are interested in a response from the server with the same OPCode we just sent.
        //
        if( callback )
        { 

            this.#_ws.addEventListener("message", (async function listener(resp){

                if( resp.data instanceof Blob )
                { 
                    this.#_ws.removeEventListener("message", listener);

                    const _opBuff = await resp.data.arrayBuffer()

                    const _opCode = new Uint8Array( _opBuff.slice(0,1) ); 
 
                    if( _opCode[0]==opcode )
                    { 
                        if( lockUntilResponded )
                        {
                            this.#_locked.delete(opcode)
                        }

                        typeof callback=='function' && callback( _opBuff )
                    }
                }

            }).bind(this) );
        }
         
        
        this.#_ws.send( new Blob( payload ) );
    }

    getMousePos() {
        this.#_offsetX = 0;
        this.#_offsetY = 0;
        this.#_mousePosition = null;


        this.#_sendBytes( OPCodes.getmouse, null, async arraybuff =>{ 

            console.log("GOT MOUSE POS!!")
            var xy                  = new Uint16Array( arraybuff.slice(1) );
            this.#_mousePosition    = { x:xy[0], y:xy[1] }; 
        })
 
    }


    holdMouse( bool ) { 
        //this.#_send({ type: "holdmouse", bool, caca:false }, true);
        this.#_sendBytes( OPCodes.holdMouse, Uint8Array.of( bool ) ) 
    }

    sendKey( keycode, isDown ) { 

        console.log("KEY CODE: ", keycode, keycodeIndex(keycode), isDown)
        this.#_sendBytes(   OPCodes.setKey, 
                            Uint8Array.of( keycodeIndex(keycode), isDown ) 
                            ) 

        //this.#_send({ type: "set-key", code:keycode, down:isDown }, true);
    }

    sendText( text ) {
        //this.#_send({ type: "send-text", text  }, true);
        this.ws.send( text );
    }

    /**
     * @param {number} dx
     * @param {number} dy
     */
    move(dx, dy) {
        //this.#_send({ type: "move", dx, dy });
        this.#_offsetX += dx;
        this.#_offsetY += dy;

        if (this.#_mousePosition) {

            this.#_sendBytes( OPCodes.moveTo, 
                Uint16Array.of(
                    this.#_mousePosition.x + this.#_offsetX,
                    this.#_mousePosition.y + this.#_offsetY
                )   
            )  
        }
    } 

    /**
     * @param {number} dx
     * @param {number} dy
     */
    drag(dx, dy) {

        this.#_offsetX += dx;
        this.#_offsetY += dy;

        //this.#_send({ type: "drag", dx, dy });
        if (this.#_mousePosition) {

            this.#_sendBytes( OPCodes.drag, 
                Uint16Array.of(
                    this.#_mousePosition.x, 
                    this.#_mousePosition.y, 
                    this.#_offsetX, 
                    this.#_offsetY
                )  
            )  
        }
    }

    rightclick() { 
        this.#_sendBytes( OPCodes.rightclick );
    }

    doubleclick() { 
        this.#_sendBytes( OPCodes.doubleclick );
    }

    click() { 
        this.#_sendBytes( OPCodes.click );
    }

    centerMouse() {
        this.#_sendBytes( OPCodes.centerMouse );
    }

    /**
     * @param {number} amount
     */
    scroll(amount) { 
        if( amount>128 ) amount=128;
        else if( amount<-128) amount=-128
        this.#_sendBytes( OPCodes.scroll, Int8Array.of(amount) ); //because values higher than 255 make no sense...
    }
}
