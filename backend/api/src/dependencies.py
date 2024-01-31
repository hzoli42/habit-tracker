from typing import Callable
import uuid
from pymongo import MongoClient
from pymongo.database import Database
from api.src.config import settings


async def mongo_db_client() -> Database:
    client = MongoClient(settings.mongo_connection_string,
                         uuidRepresentation='standard')
    db = client[settings.mongo_db_name]
    return db


async def uuid_generator() -> Callable[[], str]:
    def generate_uuid() -> str:
        new_uuid = uuid.uuid4()
        return new_uuid.hex
    return generate_uuid
