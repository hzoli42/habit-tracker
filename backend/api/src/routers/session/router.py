
from typing import Annotated
from fastapi import APIRouter, Depends
from dependencies import mongo_db_client
from .model import (PostSessionsStartRequest, PostSessionsStartResponse,
                   PostSessionsStopRequest, GetSessionsResponse)
import mongodb.session as mongodb_model
from pymongo.database import Database
import dataclasses
import uuid


router = APIRouter()

@router.post("/sessions/start")
async def add_session(input: PostSessionsStartRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> PostSessionsStartResponse:
    session_id = uuid.uuid4()
    document = mongodb_model.Session(
        id=session_id,
        user_id=input.user_id,
        actions=[],
        title=input.title,
        labels=input.labels
    )
    
    db.sessions.insert_one(dataclasses.asdict(document))
    return PostSessionsStartResponse(id=session_id)

# @router.post("/sessions/pause")
# async def pause_session(input: PostSessionsPauseRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
#     action = mongodb_model.Action(timestamp=datetime.now().timestamp(), action="pause")
#     result = db.sessions.update_one(
#         { "id": input.id },
#         { "$push" : { "actions": dataclasses.asdict(action)}}
#     )
#     print(result.raw_result)
#     return 

# @router.post("/sessions/resume")
# async def resume_session(input: PostSessionsResumeRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
#     action = mongodb_model.Action(timestamp=datetime.now().timestamp(), action="resume")
#     db.sessions.update_one(
#         { "id": input.id },
#         { "$push" : { "actions": dataclasses.asdict(action)}}
#     )
#     return

@router.post("/sessions/stop")
async def stop_session(input: PostSessionsStopRequest, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    print([a for a in input.actions])
    db.sessions.update_one(
        { "id": input.id },
        { "$push" : { "actions": { "$each": [dataclasses.asdict(a) for a in input.actions] } } }
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
            created_at=s['created_at'],
            actions=[mongodb_model.Action(**a) for a in actions],
            title=s['title'],
            labels=s['labels']
        ))
    return GetSessionsResponse(sessions=result)
