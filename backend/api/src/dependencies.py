from pymongo import MongoClient
from pymongo.database import Database

async def mongo_db_client() -> Database:
    connection_string = "mongodb+srv://hzoli42:COJYnwYB6adsMfUf@hzoli42habittracker.dau5pmq.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(connection_string)
    db = client.habit_tracker
    return db