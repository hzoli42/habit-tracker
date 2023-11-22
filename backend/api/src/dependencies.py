from typing import Callable
import uuid
from pymongo import MongoClient
from pymongo.database import Database


async def mongo_db_client() -> Database:
    connection_string = "mongodb+srv://hzoli42:COJYnwYB6adsMfUf@hzoli42habittracker.dau5pmq.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(connection_string, uuidRepresentation='standard')
    db = client.habit_tracker
    return db


async def uuid_generator() -> Callable[[], str]:
    def generate_uuid() -> str:
        new_uuid = uuid.uuid4()
        return new_uuid.hex
    return generate_uuid
