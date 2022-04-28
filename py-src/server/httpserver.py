import http
import socketserver
from utils import resource_path, get_ip 
import qrcode 
import io

PORT = 9000


class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):   
            if( self.path == "/"):
                self.path = "/index.html"

            try:
                with open( resource_path("build" + self.path), 'rb') as f:
                    data = f.read()
                self.send_response(200)
                self.end_headers()
                self.wfile.write(data)
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'not found')
            except PermissionError:
                self.send_response(403)
                self.end_headers()
                self.wfile.write(b'no permission')
            except Exception:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(b'error') 
  
 

def startHTTPServer(): 
    with socketserver.TCPServer(("", PORT), MyHttpRequestHandler) as httpd: 
        serverStartedMessage( "http://"+get_ip()+":"+ str(PORT) )  
        httpd.serve_forever()

def serverStartedMessage( url: str ):  
    """Prints a QR code on the console from the url"""
    qr = qrcode.QRCode()
    qr.add_data( url )
    f = io.StringIO()
    qr.print_ascii(out=f, invert=True)
    f.seek(0)
    print(f.read())   
    print("     Go to  →  ", url)  
    print("") 