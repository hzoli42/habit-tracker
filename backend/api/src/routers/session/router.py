
from typing import Annotated
from fastapi import APIRouter, Depends
from kafka import KafkaConsumer, KafkaProducer
from src.dependencies import mongo_db_client, kafka_producer, kafka_consumer
from . import model as router_model
import src.mongodb.session as mongodb_model
from pymongo.database import Database
import dataclasses
import time

router = APIRouter()

@router.post("/sessions")
async def add_session(user: str, session: router_model.Session, db: Annotated[Database, Depends(mongo_db_client)],
                      producer: Annotated[KafkaProducer, Depends(kafka_producer)],
                      consumer: Annotated[KafkaConsumer, Depends(kafka_consumer)]) -> None:
    # document = mongodb_model.Session(
    #     user=user,
    #     actions=session.actions
    # )
    # db.sessions.insert_one(dataclasses.asdict(document))
    for e in range(1000):
        data = {'number' : e}
        producer.send('numtest', value=data)
        time.sleep(5)

    for message in consumer:
        print(message.value)
    return


@router.get("/sessions")
async def list_sessions(user: str, db: Annotated[Database, Depends(mongo_db_client)],
                        producer: Annotated[KafkaProducer, Depends(kafka_producer)],
                        consumer: Annotated[KafkaConsumer, Depends(kafka_consumer)]) -> list[router_model.Session]:
    sessions = db.sessions.find({"user": f"{user}"})
    result = []
    for s in sessions:
        actions = s['actions']
        result.append(router_model.Session(user, actions))

    print("sending messages on kafka")
    for e in range(1):
        data = {'number' : e}
        producer.send('numtest', value=data)
        print(f"message sent: {e}")
        time.sleep(5)

    print("receiving messages from kafka")
    for message in consumer:
        print(f"message received: {message.value}")
    return result
