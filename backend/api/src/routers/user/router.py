import dataclasses
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from api.src.dependencies import mongo_db_client
from api.src.routers.user.model import UserAddLabels, UserDeleteLabels, UserNewIn
import api.src.mongodb.user as mongodb_model


router = APIRouter()


@router.post("/user/new")
def register_user(input: UserNewIn,
                  db: Annotated[Database, Depends(mongo_db_client)]) -> mongodb_model.User:
    users = list(db.users.find({"id": f"{input.id}"}))
    if len(users) != 0:
        print(
            f"Something went wrong, found {len(users)} entries for user ID {input.id}")
        return mongodb_model.User.from_dict(users[0])

    document = mongodb_model.User(
        id=input.id,
        email=input.email,
        name=input.name,
        nickname=input.nickname,
        labels=[]
    )

    db.users.insert_one(dataclasses.asdict(document))
    return get_user_by_id(input.id, db)


@router.post("/user/{user_id}/labels")
def user_add_labels(input: UserAddLabels,
                    db: Annotated[Database, Depends(mongo_db_client)]) -> mongodb_model.User:
    db.users.update_one(
        {"id": input.id},
        {"$addToSet": {"labels": {"$each": input.labels}}}
    )

    return get_user_by_id(input.id, db)


@router.delete("/user/{user_id}/labels")
def user_delete_labels(input: UserDeleteLabels,
                       db: Annotated[Database, Depends(mongo_db_client)]) -> mongodb_model.User:
    db.users.update_one(
        {"id": input.id},
        {"$pullAll": {"labels": input.labels}}
    )

    return get_user_by_id(input.id, db)


def get_user_by_id(id: str, db: Database) -> mongodb_model.User:
    user = db.users.find_one({"id": f"{id}"})
    if not user:
        raise HTTPException(status_code=404, detail="Could not find user")
    return mongodb_model.User.from_dict(user)
