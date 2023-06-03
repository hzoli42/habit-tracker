from pymongo import MongoClient
from pymongo.database import Database
from kafka import KafkaProducer, KafkaConsumer
import json

async def mongo_db_client() -> Database:
    connection_string = "mongodb+srv://hzoli42:COJYnwYB6adsMfUf@hzoli42habittracker.dau5pmq.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(connection_string)
    db = client.habit_tracker
    return db

async def kafka_producer() -> KafkaProducer:
    producer = KafkaProducer(
        bootstrap_servers=['backend-kafka.default.svc.cluster.local:9092'],
        value_serializer=lambda x: json.dumps(x).encode('utf-8')
    )
    return producer

async def kafka_consumer() -> KafkaConsumer:
    consumer = KafkaConsumer(
    'numtest',
     bootstrap_servers=['backend-kafka.default.svc.cluster.local:9092'],
     auto_offset_reset='earliest',
     enable_auto_commit=True,
     group_id='my-group',
     value_deserializer=lambda x: json.loads(x.decode('utf-8')))
    return consumer
