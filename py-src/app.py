import threading
from server.httpserver import startHTTPServer
from server.websocketserver import startWebSocketServer

if __name__ == "__main__":  
    print('''
------------------------------------------------------- 
    ___  ____    ____ ____ _  _ ____ ___ ____ 
    |__] |       |__/ |___ |\/| |  |  |  |___ 
    |    |___    |  \ |___ |  | |__|  |  |___  !
    
-------------------------------------------------------''')

    a = threading.Thread(target=startHTTPServer) 
    b = threading.Thread(target=startWebSocketServer) 
    a.start()
    b.start()  