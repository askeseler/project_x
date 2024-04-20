from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

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


class UserSchema(BaseModel):
    fullname: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "fullname": "Abdulazeez Abdulazeez Adeshina",
                "email": "abdulazeez@x.com",
                "password": "weakpassword"
            }
        }

class UserLoginSchema(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "email": "abdulazeez@x.com",
                "password": "weakpassword"
            }
        }