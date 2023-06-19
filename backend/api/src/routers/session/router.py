
from typing import Annotated
from fastapi import APIRouter, Depends
from dependencies import mongo_db_client
from .model import (PostSessionsStartRequest, PostSessionsStartResponse, PostSessionsPauseRequest,
                   PostSessionsStopRequest, PostSessionsResumeRequest, GetSessionsResponse)
import mongodb.session as mongodb_model
from pymongo.database import Database
import dataclasses
import uuid
from datetime import datetime
import bson


router = APIRouter()

@router.post("/sessions/start")
async def add_session(input: PostSessionsStartRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> PostSessionsStartResponse:
    session_id = uuid.uuid4()
    document = mongodb_model.Session(
        id=session_id,
        user_id=input.user_id,
        actions=[mongodb_model.Action(timestamp=datetime.now().timestamp(), action="start")],
        title=input.title,
        tags=input.tags
    )
    
    db.sessions.insert_one(dataclasses.asdict(document))
    return PostSessionsStartResponse(id=session_id)

@router.post("/sessions/pause")
async def pause_session(input: PostSessionsPauseRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    action = mongodb_model.Action(timestamp=datetime.now().timestamp(), action="pause")
    result = db.sessions.update_one(
        { "id": input.id },
        { "$push" : { "actions": dataclasses.asdict(action)}}
    )
    print(result.raw_result)
    return 

@router.post("/sessions/resume")
async def resume_session(input: PostSessionsResumeRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    action = mongodb_model.Action(timestamp=datetime.now().timestamp(), action="resume")
    db.sessions.update_one(
        { "id": input.id },
        { "$push" : { "actions": dataclasses.asdict(action)}}
    )
    return

@router.post("/sessions/stop")
async def stop_session(input: PostSessionsStopRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    action = mongodb_model.Action(timestamp=datetime.now().timestamp(), action="stop")
    db.sessions.update_one(
        { "id": input.id },
        { "$push" : { "actions": dataclasses.asdict(action)}}
    )
    return


@router.get("/sessions/{user_id}")
async def list_sessions(user_id: str, db: Annotated[Database, Depends(mongo_db_client)]) -> GetSessionsResponse:
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
            tags=s['tags']
        ))
    return GetSessionsResponse(sessions=result)
