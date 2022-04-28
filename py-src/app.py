
from email.mime import image
import http.server 
import socketserver # Establish the TCP Socket connections
import os
import socket
import pyautogui
import sys
import asyncio
from websockets import serve

import threading
from threading import Thread
from PIL import Image 
import qrcode 
import io


from utils import resource_path, get_ip 
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
    
   
    

#//asyncio.run(main())

#//-----------------------------------------------
# def thishost( _thishost ):
#     """Return the IP addresses of the current host."""
 
#     if _thishost is None:
#         try:
#             _thishost = tuple(socket.gethostbyname_ex(socket.gethostname())[2])
#         except socket.gaierror:
#             _thishost = tuple(socket.gethostbyname_ex('localhost')[2])
#     return _thishost 

# def resolve_host(host):
#     data = socket.gethostbyname_ex(host)
#     return data[2][0] 


# hostname = socket.getfqdn()
# print("IP Address:",  get_ip() )
 
