
from typing import Annotated
from fastapi import APIRouter, Depends
from src.dependencies import mongo_db_client
from . import model as router_model
import src.mongodb.session as mongodb_model
from pymongo.database import Database
import dataclasses

router = APIRouter()

@router.post("/sessions")
async def add_session(user: str, session: router_model.Session, db: Annotated[Database, Depends(mongo_db_client)]) -> None:
    document = mongodb_model.Session(
        user=user,
        actions=session.actions
    )
    db.sessions.insert_one(dataclasses.asdict(document))
    return


@router.get("/sessions")
async def list_sessions(user: str, db: Annotated[Database, Depends(mongo_db_client)]) -> list[router_model.Session]:
    sessions = db.sessions.find({"user": f"{user}"})
    result = []
    for s in sessions:
        actions = s['actions']
        result.append(router_model.Session(user, actions))
    return result
