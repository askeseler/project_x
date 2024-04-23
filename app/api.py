from fastapi import FastAPI, Body, Depends, Request

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from fastapi import HTTPException
from app.model import ItemSchema, UserSchema, UserLoginSchema, UserChangePwdSchema
from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import signJWT
import app.database
from app.database import *
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from fastapi import Body
import requests
import json 
import os

#Email stuff
import smtplib
from email.mime.text import MIMEText
import secrets

with open("./frontend/src/components/env.json") as f:
    settings = json.loads(f.read())
    SITE_URL = settings["SITE_URL"]
    GMAIL_PWD = settings["GMAIL_PWD"]

sign_up_tokens = ['test&michael.werner.gerstenberger@gmail.com']

#Recaptcha stuff
recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify'
recaptcha_secret_key = None
with open("./frontend/src/components/env.json") as f:
    recaptcha_secret_key = json.loads(f.read())["SITE_SECRET"]

#users = [{'fullname': 'Michael G', 'email': 'michael@x.com', 'password': 'weakpassword', 'role':'admin'}]

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#@app.get("/items", dependencies=[Depends(JWTBearer())], tags=["items"])
@app.get("/items", tags=["items"])
async def get_items() -> dict:
    items = await get_items_db()
    return {"items":items}


@app.get("/item/{no}", tags=["item"])
async def get_single_item(no: int) -> dict:
    item = await get_item_db(no)
    return {"item":item}

#@app.post("/add_item", dependencies=[Depends(JWTBearer())], tags=["add_item"])
@app.post("/add_item", tags=["add_item"])
async def add_post(item: ItemSchema) -> dict:
    item = item.dict()
    date = item["date"]
    f = "%Y-%m-%dT%H:%M:%S"
    item["date"] = datetime.strptime(date, f).replace(microsecond=0)
    item = await add_item_db(item)
    return {"item":item}

@app.post("/user/change_password", tags=["user_management"])
async def change_password(data: UserChangePwdSchema):
    data = data.dict()
    sign_up_token = data["token"] + "&" + data["email"]
    if not sign_up_token in sign_up_tokens:
        raise HTTPException(status_code=401, detail="Sign up token invalid.")
    else:
        sign_up_tokens.remove(sign_up_token)
        if not "fullname" in data.keys():
            data["fullname"] = ""
        data["role"] = "user"
        return await add_user_db(data)
        
def send_gmail(subject, body, sender, recipients, password):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = ', '.join(recipients)
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
       smtp_server.login(sender, password)
       smtp_server.sendmail(sender, recipients, msg.as_string())
    print("Message sent!")

@app.post("/user/send_sign_up_mail", tags=["user_management"])
async def send_signup_mail(request: Request):
    json = await request.json()
    response = requests.post(url = recaptcha_url, data = {'secret': recaptcha_secret_key, 'response': json["captchaValue"]})
    if response.json().get('success', False):
        token = secrets.token_urlsafe(30*3//4)
        subject = "Signup to socialmediahub.pro"
        body = "To complete registration and set yout account password use this link:\n" + SITE_URL + "pwd_token?token=" + token + "&email=" + json["email"] + "\n Cheers and have fun!"
        sender = "hordeum.berlin@gmail.com"
        recipients = [json["email"]]
        password = GMAIL_PWD
        sign_up_tokens.append(token + "&" + json["email"])

        send_gmail(subject, body, sender, recipients, password)
        return True
    else:
        return False

#@app.post("/user/verify", tags=["user_management"])
#async def verify_captcha(captchaValue = Body(..., embed=True)):
#    response = requests.post(url = recaptcha_url, data = {'secret': recaptcha_secret_key, 'response': captchaValue})
#    return response.json().get('success', False)

@app.post("/user/signup", dependencies=[Depends(JWTBearer(condition ={"role":"admin"}))], tags=["user_management"])
async def create_user(user: UserSchema = Body(...)):
    user = add_user_db(user)

    print(user)
    #replace with db call, making sure to hash the password first
    return signJWT(dict(user))

@app.post("/user/login", tags=["user_managent"])
async def user_login(user: UserLoginSchema = Body(...)):
    json = await request.json()
    response = requests.post(url = recaptcha_url, data = {'secret': recaptcha_secret_key, 'response': json["captchaValue"]})
    if response.json().get('success', False):
        if verify_user_db(user):
            return signJWT(dict(user))
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    else:
        HTTPException(status_code=401, detail="Invalid Captcha Token")

@app.get("/pwd_token")
def pwd_token(token: str = "", email: str = ""):
    print(token)
    print(email.replace("%40", "@"))
    rr = RedirectResponse('SettingsPage', status_code=303)
    rr.set_cookie(key="new_pwd_token", value=token)
    rr.set_cookie(key="email", value=email)
    return rr


@app.get("{full_path:path}")
async def catch_all(request: Request, full_path: str):
    directory="frontend/build/"
    full_path = directory + full_path
    if os.path.isfile(full_path):
        return FileResponse(full_path)
    else:
        full_path = directory+"index.html"
        return FileResponse(full_path)