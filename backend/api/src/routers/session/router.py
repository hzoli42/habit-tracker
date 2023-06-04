
from typing import Annotated
from fastapi import APIRouter, Depends
from dependencies import mongo_db_client
from .model import (PostSessionsStartRequest, PostSessionsPauseRequest,PostSessionsStopRequest,
                   PostSessionsResumeRequest, GetSessionsResponse)
import mongodb.session as mongodb_model
from pymongo.database import Database
import dataclasses
import uuid
from datetime import datetime
import bson


router = APIRouter()

@router.post("/sessions/start")
async def add_session(input: PostSessionsStartRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    document = mongodb_model.Session(
        id=uuid.uuid4(),
        user=input.user,
        actions=[mongodb_model.Action(timestamp=datetime.now().timestamp(), action="start")]
    )
    
    db.sessions.insert_one(dataclasses.asdict(document))
    return

@router.post("/sessions/pause")
async def add_session(input: PostSessionsPauseRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    action = mongodb_model.Action(timestamp=datetime.now().timestamp(), action="pause")
    result = db.sessions.update_one(
        { "id": input.id },
        { "$push" : { "actions": dataclasses.asdict(action)}}
    )
    print(result.raw_result)
    return 

@router.post("/sessions/resume")
async def add_session(input: PostSessionsResumeRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    action = mongodb_model.Action(timestamp=datetime.now().timestamp(), action="resume")
    db.sessions.update_one(
        { "id": input.id },
        { "$push" : { "actions": dataclasses.asdict(action)}}
    )
    return

@router.post("/sessions/stop")
async def add_session(input: PostSessionsStopRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    action = mongodb_model.Action(timestamp=datetime.now().timestamp(), action="stop")
    db.sessions.update_one(
        { "id": input.id },
        { "$push" : { "actions": dataclasses.asdict(action)}}
    )
    return


@router.get("/sessions/{user}")
async def list_sessions(user: str, db: Annotated[Database, Depends(mongo_db_client)]) -> GetSessionsResponse:
    sessions = db.sessions.find({"user": f"{user}"})
    result = []
    for s in [s for s in sessions if 'id' in s]:
        actions = s['actions']
        result.append(
            mongodb_model.Session(
            id=s['id'],
            user=s['user'],
            actions=[mongodb_model.Action(**a) for a in actions]
        ))
    return GetSessionsResponse(sessions=result)
