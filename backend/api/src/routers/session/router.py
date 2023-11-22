
from typing import Annotated, Callable
from fastapi import APIRouter, Depends, HTTPException
from .model import SessionActionIn, SessionAllOut, SessionStartIn
from api.src.dependencies import mongo_db_client, uuid_generator

import api.src.mongodb.session as mongodb_model
from pymongo.database import Database
import dataclasses
import uuid


router = APIRouter()


@router.post("/session/start")
async def start_session(input: SessionStartIn,
                        db: Annotated[Database, Depends(mongo_db_client)],
                        get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> mongodb_model.Session:
    session_id = get_uuid()
    document = mongodb_model.Session(
        id=session_id,
        user_id=input.user_id,
        actions=[input.action],
        title=input.title,
        labels=input.labels
    )

    db.sessions.insert_one(document.dict())
    return get_session_by_id(session_id, db)


@router.post("/session/action")
async def action_session(input: SessionActionIn,
                         db: Annotated[Database, Depends(mongo_db_client)]) -> mongodb_model.Session:
    current_session = get_session_by_id(input.id, db)
    last_action = current_session.actions[-1]
    if last_action.action == "stop":
        raise HTTPException(
            status_code=400, detail="Session has already ended")
    if ((last_action.action == "pause" and input.action != "resume") or
        (last_action.action == "resume" and input.action != "pause") or
            input.action == "stop"):
        raise HTTPException(status_code=400, detail="Invalid order of actions")

    db.sessions.update_one(
        {"id": input.id},
        {"$push": {"actions": input.action.dict()}}
    )

    return get_session_by_id(input.id, db)


@router.get("/session/{id}")
async def get_session(id: str,
                      db: Annotated[Database, Depends(mongo_db_client)]) -> mongodb_model.Session:
    return get_session_by_id(id, db)


@router.get("/session/{user_id}/all")
async def user_all_session(user_id: str,
                           db: Annotated[Database, Depends(mongo_db_client)]) -> SessionAllOut:
    sessions = db.sessions.find({"user_id": f"{user_id}"})
    result = []
    for s in [s for s in sessions if 'id' in s]:
        result.append(mongodb_model.Session.from_dict(s))
    return SessionAllOut(sessions=result)


def get_session_by_id(id: str, db: Database) -> mongodb_model.Session:
    session = db.sessions.find_one({"id": f"{id}"})
    if not session:
        raise HTTPException(status_code=404, detail="Could not find session")
    return mongodb_model.Session.from_dict(session)
