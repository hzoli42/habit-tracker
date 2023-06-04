from pymongo import MongoClient
from pymongo.database import Database
from kafka import KafkaProducer, KafkaConsumer
import json

async def mongo_db_client() -> Database:
    connection_string = "mongodb+srv://hzoli42:COJYnwYB6adsMfUf@hzoli42habittracker.dau5pmq.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(connection_string, uuidRepresentation='standard')
    db = client.habit_tracker
    return db
