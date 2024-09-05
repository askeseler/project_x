import motor.motor_asyncio
from bson.objectid import ObjectId
from decouple import config
import bcrypt
from decouple import config
import random
import numpy as np
from datetime import datetime
from datetime import datetime as dt, timedelta as td

pwd_salt = config("pwd_salt_str").encode()
bcrypt.hashpw(b"test", pwd_salt)

MONGO_DETAILS = "mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb"#config("MONGO_DETAILS")  # read environment variable

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client.items
item_collection = database.get_collection("items_collection")
user_collection = database.get_collection("user_collection")


# helpers
def item2dict(json) -> dict:
    return {
        "id": str(json["_id"]),
        "title": json["title"],
        "accountname": json["accountname"],
        "video_id": json["video_id"],
        "title": json["title"],
        "subtitles": json["subtitles"],
        "comments": json["comments"],
        "n_comments": json["n_comments"],
        "n_likes": json["n_likes"],
        "channel_name": json["channel_name"],
        "date": str(json["date"]),
        "time_watched": json["time_watched"]
    }

async def get_random_set(n = 1000, seed = 42):
    if False:
        count = await item_collection.estimated_document_count()
        np.random.seed(seed)
        idxs = np.random.randint(0,count, n)
        items = []
        for idx in idxs:
            item = await item_collection.find().limit(-1).skip(int(idx)).next()
            items.append(item2dict(item))
        return items
    else:
        cursor = item_collection.aggregate([{'$sample': {'size': n}}])
        return await cursor.to_list(length=None)

async def get_dist_of(attr="n_comments", bins = 10, range=(0,10000)):
    items = await get_random_set()
    vals = [i[attr] for i in items]
    n, bin_bounds = np.histogram(vals, bins = bins, range=range)
    bin_bounds = bin_bounds[1:]
    return n, bin_bounds

async def get_daily_user_activity(start = '2024-01-01', end = '2024-07-1'):
    items = []
    async for item in item_collection.find().sort('date',-1):
        items.append(item["date"].strftime('%Y-%m-%d'))

    def empty_dates_dict(start = '2024-01-01', end = '2024-07-1'):
        sd = dt.strptime(start,'%Y-%m-%d')
        ed = dt.strptime(end,'%Y-%m-%d')
        delta = ed - sd
        d = {}
        for i in range(delta.days+1):
            d[(sd + td(days=i)).strftime('%Y-%m-%d')] = "0"
        return d

    unique, counts = np.unique(np.array(items), return_counts=True)
    d = empty_dates_dict(start, end)
    for u, c in zip(unique, counts):
        d[str(u)] = int(c)
    return [{"date":k,"value":v} for k, v in d.items()]


# Retrieve all items present in the database
async def get_items_db():
    items = []
    async for item in item_collection.find().sort('date',-1).limit(50):
        items.append(item2dict(item))
    return items

# Add a new item into to the database
async def add_item_db(item_data: dict) -> dict:
    item = await item_collection.insert_one(item_data)
    new_item = await item_collection.find_one({"_id": item.inserted_id})
    return item2dict(new_item)

# Retrieve a item with a matching ID
async def get_item_db(no: str) -> dict:
    item = await item_collection.find_one({"no": no})
    if item:
        return item2dict(item)
    else:
        return {}

# Update a item with a matching ID
async def update_item_db(id: str, data: dict):
    raise NotImplemented("TODO")

    # Return false if an empty request body is sent.
    if len(data) < 1:
        return False
    item = await item_collection.find_one({"_id": ObjectId(id)})
    if item:
        updated_item = await item_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_item:
            return True
        return False


# Delete a item from the database
async def delete_item_db(id: str):
    raise NotImplemented("TODO")
    item = await item_collection.find_one({"_id": ObjectId(id)})
    if item:
        await item_collection.delete_one({"_id": ObjectId(id)})
        return True


##################### USER MANAGEMENT #################

def dbitem2user(data):
    item = {
        "email": data["_id"],
        "username": data["username"],
        "role": data["role"],
    }
    return item

def user2dbitem(data):
    data = dict(data)
    if not "username" in data.keys():
        data["username"] = ""
    if not "role" in data.keys():
        data["role"] = "user"
    item = {
        "role": data["role"],
        "username": data["username"],
        "_id": data["email"],
        "password": data["password"]
    }
    return item

# Add a new user into to the database
async def add_user_db(data: dict) -> dict:
    data = user2dbitem(data)
    data["password"] = bcrypt.hashpw(data["password"].encode(), pwd_salt)

    found = await user_collection.find_one({"_id":data["_id"]})
    if not found:
        res = await user_collection.insert_one(data)
        print(res)
    else:
        await user_collection.replace_one(found, data)
    return dbitem2user(data)

async def verify_user_db(data: dict) -> bool:
    data = user2dbitem(data)
    password = bcrypt.hashpw(data["password"].encode(), pwd_salt)
    data = await user_collection.find_one({"_id": data["_id"]})
    if data and password == data["password"]:
        return True
    else:
        return False

# Retrieve all items present in the database
async def get_users_db():
    items = []
    async for item in user_collection.find():
        items.append(dbitem2user(item))
    return items

async def delete_all_users_db():
    await user_collection.delete_many({})
    return {}