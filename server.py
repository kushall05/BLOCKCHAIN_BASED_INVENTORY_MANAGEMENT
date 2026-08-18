"""
Blockchain-Based Inventory Management Web App Server
Supports local execution (port 8000) and cloud Web Service deployment (Render / Heroku $PORT).
"""

import http.server
import socketserver
import webbrowser
import sys
import os
import threading
import time

PORT = int(os.environ.get("PORT", 8000))

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep terminal output clean
        sys.stderr.write("%s - - [%s] %s\n" %
                         (self.client_address[0] if hasattr(self, 'client_address') else "127.0.0.1",
                          self.log_date_time_string(),
                          format % args))

def open_browser():
    time.sleep(1)
    url = f"http://localhost:{PORT}"
    print(f"Opening {url} in web browser...")
    try:
        webbrowser.open(url)
    except Exception:
        pass

if __name__ == "__main__":
    Handler = QuietHTTPRequestHandler
    
    print(f"=========================================================")
    print(f"  BLOCKCHAIN-BASED INVENTORY MANAGEMENT SYSTEM WEB APP  ")
    print(f"=========================================================")
    print(f"Server starting on port {PORT}...")
    print("Press Ctrl+C to stop server.\n")

    # Only attempt to open browser if running locally (not in production cloud environment)
    if "RENDER" not in os.environ:
        threading.Thread(target=open_browser, daemon=True).start()

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
