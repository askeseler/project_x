from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from fastapi import Query


class ItemSchema(BaseModel):
    title: str = Field(...)
    accountname: str = Field(...)
    video_id: str = Field(...)
    title: str = Field(...)
    subtitles: str = Field(...)
    comments: str = Field(...)
    n_comments: int = Field(...)
    n_likes: int = Field()
    channel_name: str = Field(...)
    date: str = Field()
    time_watched: int = Field()

    class Config:
        schema_extra = {
            "accountname":"eler90","video_id":"V-l9WkI_lRk","title":"Stop gatekeeping SPILL THE BEANS!","subtitles":"public executions are rarely a good","comments":"[\"Bro is using all the tools he was given in life\",\"Who else just found this out\\n\]","n_comments":987,"n_likes":262000,"channel_name":"@Deanobballin","date":"18/4/2024 @ 23:51:12","time_watched":1330
            }

class UserChangePwdSchema(BaseModel):
    email: EmailStr = Field(...)
    username: str = Field(...)
    password: str = Field(...)
    token: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "email": "michael@x.com",
                "username": "michael",
                "password": "weakpassword",
                "token": "b327d834c7d8347a8"
            }
        }

class UserSchema(BaseModel):
    username: str = Field(...)
    email: EmailStr = Field(...)
    role: str = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "username": "Michael",
                "email": "michael@x.com",
                "password": "weakpassword",
                "role": "admin"
            }
        }

class UserLoginSchema(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "email": "michael@x.com",
                "password": "weakpassword",
            }
        }