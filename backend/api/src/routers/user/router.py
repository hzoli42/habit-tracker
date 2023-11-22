import dataclasses
from typing import Annotated
from fastapi import APIRouter, Depends
from pymongo.database import Database

from backend.api.src.dependencies import mongo_db_client
from backend.api.src.routers.user.model import UserLoginIn, UserLoginOut
import mongodb.user as mongodb_model


router = APIRouter()


@router.post("/user/login")
def register_user(input: UserLoginIn, db: Annotated[Database, Depends(mongo_db_client)]) -> UserLoginOut:
    users = list(db.users.find({"id": f"{input.id}"}))
    if len(users) > 1:
        print(
            f"Something went wrong, found {len(users)} entries for user ID {input.id}")

    if len(users) == 1:
        return UserLoginOut(id=input.id)

    document = mongodb_model.User(
        id=input.id,
        email=input.email,
        name=input.name
    )

    db.sessions.insert_one(dataclasses.asdict(document))
    return UserLoginOut(id=input.id)
