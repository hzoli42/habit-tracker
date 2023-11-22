
from typing import Annotated
from fastapi import APIRouter, Depends
from .model import SessionAllOut, SessionStartIn, SessionStartOut, SessionStopIn
from api.src.dependencies import mongo_db_client

import api.src.mongodb.session as mongodb_model
from pymongo.database import Database
import dataclasses
import uuid


router = APIRouter()


@router.post("/session/start")
async def start_session(input: SessionStartIn, db: Annotated[Database, Depends(mongo_db_client)]) -> SessionStartOut:
    session_id = uuid.uuid4()
    document = mongodb_model.Session(
        id=session_id,
        user_id=input.user_id,
        actions=[],
        title=input.title,
        labels=input.labels
    )

    db.sessions.insert_one(dataclasses.asdict(document))
    return SessionStartOut(id=session_id)


@router.post("/session/stop")
async def stop_session(input: SessionStopIn, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    print([a for a in input.actions])
    db.sessions.update_one(
        {"id": input.id},
        {"$push": {"actions": {
            "$each": [dataclasses.asdict(a) for a in input.actions]}}}
    )
    return


@router.get("/session/{user_id}/all")
async def user_all_session(user_id: str, db: Annotated[Database, Depends(mongo_db_client)]) -> SessionAllOut:
    sessions = db.sessions.find({"user_id": f"{user_id}"})
    result = []
    for s in [s for s in sessions if 'id' in s]:
        actions = s['actions']
        result.append(
            mongodb_model.Session(
                id=s['id'],
                user_id=s['user_id'],
                actions=[mongodb_model.Action(**a) for a in actions],
                title=s['title'],
                labels=s['labels']
            ))
    return SessionAllOut(sessions=result)
