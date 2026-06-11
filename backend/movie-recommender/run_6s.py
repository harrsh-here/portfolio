import uvicorn
from multiprocessing import Process
import time
from main import app
import os

os.environ["OMDB_KEY"] = "968ca803"

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="critical")

if __name__ == "__main__":
    print("ONLINE! (Running for exactly 6 seconds...)")
    p = Process(target=run_server)
    p.start()
    time.sleep(6)
    p.terminate()
    p.join()
    print("OFFLINE! (Server terminated.)")
