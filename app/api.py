from fastapi import FastAPI, Body, Depends, Request

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from fastapi import HTTPException
from app.model import ItemSchema, UserSchema, UserLoginSchema
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
from fastapi import Response
from fastapi.responses import JSONResponse

#Email stuff
import smtplib
from email.mime.text import MIMEText
import secrets

DEBUG = True

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

#@app.get("/items", tags=["items"])
@app.get("/items", dependencies=[Depends(JWTBearer())], tags=["items"])
async def get_items() -> dict:
    items = await get_items_db()
    return {"items":items}


@app.get("/item/{no}", tags=["items"])
async def get_single_item(no: int) -> dict:
    item = await get_item_db(no)
    return {"item":item}

#@app.post("/add_item", dependencies=[Depends(JWTBearer())], tags=["add_item"])
@app.post("/add_item", tags=["items"])
async def add_post(item: ItemSchema) -> dict:
    item = item.dict()
    date = item["date"]
    f = "%Y-%m-%dT%H:%M:%S"
    try:
        item["date"] = datetime.strptime(date, f).replace(microsecond=0)
    except:
        print("incorrect time format")
        item["date"] = datetime.now().replace(microsecond=0)
    item = await add_item_db(item)
    return {"item":item}

########################## USER MANAGEMENT ####################
@app.get("/user/list_all", tags=["user_management"])
async def users_list():
    return await get_users_db()
        
def send_gmail(subject, body, sender, recipients, password):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = ', '.join(recipients)
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
       smtp_server.login(sender, password)
       smtp_server.sendmail(sender, recipients, msg.as_string())

@app.post("/user/send_sign_up_mail", tags=["user_management"])
async def send_signup_mail(request: Request):
    json = await request.json()
    response = requests.post(url = recaptcha_url, data = {'secret': recaptcha_secret_key, 'response': json["captchaValue"]}).json()
    if not response["success"]:
        raise HTTPException(status_code=401, detail="Sign up token invalid.")
    else:
        new_pwd_token = secrets.token_urlsafe(30*3//4)
        email = json["email"]
        subject = "Signup to socialmediahub.pro"
        body = "To complete registration and set yout account password use this link:\n" + SITE_URL + "new_pwd_redirect?new_pwd_token=" + new_pwd_token + "&email=" + email.replace("@", "%40") + "\n Cheers and have fun!"
        sender = "hordeum.berlin@gmail.com"
        recipients = [json["email"]]
        sign_up_token = new_pwd_token + "&" + email
        sign_up_tokens.append(sign_up_token)
        send_gmail(subject, body, sender, recipients, GMAIL_PWD)
        return JSONResponse({})

@app.get("/new_pwd_redirect", tags=["user_management"])
def new_pwd_redirect(new_pwd_token: str = "", email: str = ""):
    """ Sets cookies and redirects to SettingsPage """
    email = email.replace("%40", "@")
    rr = RedirectResponse('SettingsPage', status_code=303)
    set_http_only_cookie(rr, key="new_pwd_token", value=new_pwd_token)
    set_http_only_cookie(rr, key="email", value=email)
    rr.set_cookie(key="user_has_token", value="true")
    rr.set_cookie(key="user_email", value=email)#will be transferred to state in frontend
    return rr

@app.post("/user/change_password", tags=["user_management"])
async def change_password(request: Request, data: UserLoginSchema):
    data = data.dict()
    new_pwd_token: str = request.cookies.get("new_pwd_token")
    email: str = request.cookies.get("email")
    sign_up_token = new_pwd_token + "&" + email
    if not sign_up_token in sign_up_tokens:
        raise HTTPException(status_code=401, detail="Sign up token invalid.")
    else:
        sign_up_tokens.remove(sign_up_token)
        if not "username" in data.keys():
            data["username"] = ""
        data["role"] = "user"
        data["email"] = email
        return await add_user_db(data)

def set_http_only_cookie(response, key, value):
    """ Sets hhtp.only cookie (readable by backend only and thus invulnerable to XSS attacks). 
        To make sure XSRF attacks are not possible in production same-site cookies must be used and they should be transferred securely"""
    if not DEBUG:
        response.set_cookie(key=key, value=value, httponly=True, secure=True, SameSite="strict")
    else:
        response.set_cookie(key=key, value=value, httponly=True)

#@app.post("/user/verify", tags=["user_management"])
#async def verify_captcha(captchaValue = Body(..., embed=True)):
#    response = requests.post(url = recaptcha_url, data = {'secret': recaptcha_secret_key, 'response': captchaValue})
#    return response.json().get('success', False)
@app.post("/user/test_token", tags =["user_management"])
async def set_token(user: UserLoginSchema = Body(...)):
    """
            const response = await fetch("http://localhost:8081/user/test_token", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
            email: "m@g.com", password:"opo"
            }),
        });
        const json = await response.json();
        console.log(json);
    """
    response = JSONResponse(content={})
    access_token = signJWT(dict(user))
    response.set_cookie(key="access_token",value=f"Bearer {access_token}", httponly=True) #TODO set secure=true, max_age etc.
    return response

@app.get("/user/test_token", tags=["user_management"])
async def read_token(request: Request):
    access_token: str = request.cookies.get("access_token")  #changed to accept access token from httpOnly Cookie
    return {"access_token": access_token}


#@app.post("/user/signup", dependencies=[Depends(JWTBearer(condition ={"role":"admin"}))], tags=["user_management"])
#async def create_user(user: UserSchema = Body(...)):
#    user = add_user_db(user)
#    return {}

@app.post("/user/login", tags=["user_management"])
async def user_login(request: Request, user: UserLoginSchema):
    json = await request.json()
    response = requests.post(url = recaptcha_url, data = {'secret': recaptcha_secret_key, 'response': json["captchaValue"]}).json()
    if not response["success"]:
        raise HTTPException(status_code=429, detail="ReCaptcha Failed")
    if await verify_user_db(user):
        response = JSONResponse(content={})
        access_token = signJWT(dict(user))
        #response.set_cookie(key="access_token",value=f"Bearer {access_token}", httponly=True) #TODO set secure=true, "SameSite" to "Strict", max_age etc.
        set_http_only_cookie(response, "access_token", access_token)
        return response
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.delete("/user/delete_all", tags=["user_management"])
async def delete_all_users():
    return await delete_all_users_db()

######################## STATIC FILES #########################
@app.get("{full_path:path}", tags=["static_files_frontend"])
async def catch_all(request: Request, full_path: str):
    directory="frontend/build/"
    full_path = directory + full_path
    if os.path.isfile(full_path):
        return FileResponse(full_path)
    else:
        full_path = directory+"index.html"
        return FileResponse(full_path)

