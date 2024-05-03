import uvicorn
import subprocess
import argparse
import sys
from threading import Thread
import time

parser = argparse.ArgumentParser()
parser.add_argument("--backend", action="store_true")
parser.add_argument("--all", action="store_true")

args = parser.parse_args()

if __name__ == "__main__":
    if args.backend:
        p = subprocess.Popen("sudo bash mongodb_run.sh", shell =  True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        uvicorn.run("app.api:app", host="0.0.0.0", port=8081, reload=True)
    elif args.all:
        p = subprocess.Popen("sudo bash build_frontend.sh", shell = True)
        p.wait()
        p = subprocess.Popen("sudo bash mongodb_run.sh", shell =  True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        uvicorn.run("app.api:app", host="0.0.0.0", port=8081, reload=True)
    else:
        print("Specify --all or --backend")
