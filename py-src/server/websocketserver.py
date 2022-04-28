import pyautogui
from websockets import serve
import asyncio
from data.opcodes import OPCode
from data.keycodes import keycode2string
import struct

pyautogui.FAILSAFE = False
pyautogui.PAUSE = 0

#
# https://docs.python.org/3.7/library/struct.html#format-characters
# https://websockets.readthedocs.io/en/stable/reference/server.html
#


async def echo(websocket): 
    async for message in websocket:

        if( type( message ) is bytes ):
            await _handleBytes( message, websocket )
        else: 
            pyautogui.write( message ) 



async def _handleBytes( bytesMsg, websocket ):
    """ handle byte data sent from the client """
    
    opcode      = bytesMsg[0] 
    response    = bytearray( bytesMsg[0:1] )

    #
    # MOVE TO
    #
    if( opcode == OPCode.moveTo ):
        (x, y) = struct.unpack('<HH', bytesMsg[1:]) 
        pyautogui.moveTo( x, y )
        #await websocket.send( response ) # returns the opcode back to the client.

    #
    # GET MOUSE POSITION
    #
    elif( opcode== OPCode.getmouse):
        pos     = pyautogui.position()    
        xBytes = pos.x.to_bytes(length=2, byteorder="little") 
        yBytes = pos.y.to_bytes(length=2, byteorder="little")   
         
        response += xBytes
        response += yBytes
        await websocket.send( response ) 

    #
    # HOLD MOUSE
    #
    elif( opcode==OPCode.holdMouse ):
        bool = bytesMsg[1] 
        if( bool==1 ):
            pyautogui.mouseDown()
        else: 
            pyautogui.mouseUp()

    #
    # SET KEY
    #
    elif( opcode==OPCode.setKey ):
        (kcode, isDown) = struct.unpack('BB', bytesMsg[1:])
        kname = keycode2string( kcode )
        if( isDown==1 ):
            pyautogui.keyDown(kname)
        else:
            pyautogui.keyUp(kname)

    #
    # DRAG
    #
    elif( opcode == OPCode.drag ):
        (x, y, dx, dy) = struct.unpack('<HHHH', bytesMsg[1:]) 
        pyautogui.moveTo( x, y, 1.0 ) 
        pyautogui.drag( dx, dy, button='left' ) 
        #await websocket.send( response ) # returns the opcode back to the client. 

    #
    # CLICK
    #
    elif( opcode == OPCode.click ):
        pyautogui.click()

    #
    # DOUBLE CLICK
    #
    elif( opcode == OPCode.doubleclick ):
        pyautogui.doubleClick()

    #
    # RIGHT CLICK
    #
    elif( opcode == OPCode.rightclick ):
        pyautogui.rightClick() 

    #
    # SCROLL
    #
    elif( opcode == OPCode.scroll ):
        (scrollY) = struct.unpack('<b', bytesMsg[1:])  
        pyautogui.scroll( scrollY[0] )
        #await websocket.send( response ) # returns the opcode back to the client.

    #
    # CENTER MOUSE ON SCREEN
    #
    elif( opcode==OPCode.centerMouse ):
        (w,h) = pyautogui.size()
        centerX = w/2
        centerY = h/2
        pyautogui.moveTo(centerX, centerY, 0.5, pyautogui.easeOutElastic )


    


async def _main():  
    async with serve(echo, "", 8000):
        await asyncio.Future()  # run forever

def startWebSocketServer():
    asyncio.run(_main())