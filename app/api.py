from fastapi import FastAPI, Body, Depends

from fastapi.staticfiles import StaticFiles
from app.model import ItemSchema, UserSchema, UserLoginSchema
from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import signJWT
import app.database
from app.database import *
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

users = [{'fullname': 'Abdulazeez Abdulazeez Adeshina', 'email': 'abdulazeez@x.com', 'password': 'weakpassword'}]

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def check_user(data: UserLoginSchema):
    for user in users:
        if user.email == data.email and user.password == data.password:
            return True
    return False


# route handlers

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


@app.post("/user/signup", tags=["user"])
async def create_user(user: UserSchema = Body(...)):
    print(dict(user))
    users.append(user)  # replace with db call, making sure to hash the password first
    return signJWT(user.email)


@app.post("/user/login", tags=["user"])
async def user_login(user: UserLoginSchema = Body(...)):
    if check_user(user):
        return signJWT(user.email)
    return {
        "error": "Wrong login details!"
    }

app.mount("/", StaticFiles(directory="frontend/build/", html = True), name="static")