import uvicorn
from multiprocessing import Process
import time
from main import app
import os

os.environ["OMDB_KEY"] = "968ca803"

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="critical")

if __name__ == "__main__":
    print("OFFLINE! (Waiting 5 seconds...)")
    time.sleep(5)

    print("ONLINE! (Running for 8 seconds...)")
    p = Process(target=run_server)
    p.start()
    time.sleep(8)
    p.terminate()
    p.join()

    print("OFFLINE! (Waiting 6 seconds...)")
    time.sleep(6)
    
    print("ONLINE! (Running for 10 seconds...)")
    p2 = Process(target=run_server)
    p2.start()
    time.sleep(10)
    p2.terminate()
    p2.join()
    
    print("OFFLINE! (Waiting 4 seconds...)")
    time.sleep(4)

    print("PERMANENTLY ONLINE!")
    run_server()
