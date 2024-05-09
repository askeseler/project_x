import uvicorn
import subprocess
import argparse
import sys
from threading import Thread
import time
from dotenv import load_dotenv

parser = argparse.ArgumentParser()
parser.add_argument("--backend", action="store_true")
parser.add_argument("--backend_plus", action="store_true")
parser.add_argument("--all", action="store_true")

args = parser.parse_args()
load_dotenv(".env")


if __name__ == "__main__":
    # Copy .env file such that it is accessible by npm run and npm run-script build.
    # Variables that are backend secrets do not start with REACT_APP_ and will thus not be included in the frontend build.
    p = subprocess.Popen("cp .env ./frontend/.env", shell = True)
    p.wait()
    if args.backend_plus:
        p = subprocess.Popen("sudo bash mongodb_run.sh", shell =  True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        uvicorn.run("app.api:app", host="0.0.0.0", port=8081, reload=True)
    elif args.all:
        p = subprocess.Popen("sudo bash build_frontend.sh", shell = True)
        p.wait()
        p = subprocess.Popen("sudo bash mongodb_run.sh", shell =  True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        uvicorn.run("app.api:app", host="0.0.0.0", port=8081, reload=True)
    elif args.backend:
        uvicorn.run("app.api:app", host="0.0.0.0", port=8081, reload=True)
    else:
        print("Specify --all or --backend")