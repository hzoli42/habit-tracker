import dataclasses
from typing import Annotated, Callable
from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from api.src.dependencies import mongo_db_client, uuid_generator
from api.src.routers.user.model import UserUpdateLabelsIn, UserDeleteLabelsIn, UserGetLabelsOut, UserNewIn
import api.src.mongodb.user as mongodb_model


router = APIRouter()


@router.post("/user/new")
def register_user(input: UserNewIn,
                  db: Annotated[Database, Depends(mongo_db_client)]) -> mongodb_model.User:
    users = list(db.users.find({"id": f"{input.sub}"}))
    if len(users) != 0:
        print(
            f"Something went wrong, found {len(users)} entries for user ID {input.sub}")
        return mongodb_model.User.from_dict(users[0])

    document = mongodb_model.User(
        id=input.sub,
        email=input.email,
        name=input.name,
        nickname=input.nickname,
        labels=[]
    )

    db.users.insert_one(dataclasses.asdict(document))
    return get_user_by_id(input.sub, db)


@router.post("/user/{user_id}/labels")
def user_update_labels(user_id: str,
                       input: UserUpdateLabelsIn,
                       db: Annotated[Database, Depends(mongo_db_client)],
                       get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> list[mongodb_model.LabelData]:
    input_existing_labels = [l for l in input.labels if l.id != ""]
    input_new_labels = [l for l in input.labels if l.id == ""]

    new_label_data = []
    for l in input_new_labels:
        l.id = get_uuid()
        new_label_data.append(mongodb_model.LabelData(
            id=l.id, labelName=l.labelName, labelColor=l.labelColor))

    db.users.update_one(
        {"id": user_id},
        {"$set": {"labels": [
            l.__dict__ for l in input_existing_labels + input_new_labels]}}
    )

    return new_label_data


@router.get("/user/{user_id}/labels")
def user_get_labels(user_id: str,
                    db: Annotated[Database, Depends(mongo_db_client)]) -> UserGetLabelsOut:
    user_data = get_user_by_id(user_id, db)

    return UserGetLabelsOut(id=user_data.id, labels=user_data.labels)


@router.get("/user/{user_id}/labels/{label_id}")
def user_get_label_by_id(user_id: str,
                         label_id: str,
                         db: Annotated[Database, Depends(mongo_db_client)]) -> UserGetLabelsOut:
    user_data = get_user_by_id(user_id, db)

    return UserGetLabelsOut(id=user_data.id, labels=[x for x in user_data.labels if x.id == label_id])


@router.delete("/user/{user_id}/labels")
def user_delete_labels(user_id: str,
                       input: UserDeleteLabelsIn,
                       db: Annotated[Database, Depends(mongo_db_client)]) -> mongodb_model.User:
    db.users.update_one(
        {"id": user_id},
        {"$pullAll": {"labels": input.labels}}
    )

    return get_user_by_id(user_id, db)


@router.delete("/user/{user_id}/labels/{label_id}")
def user_delete_label_by_id(user_id: str,
                            label_id: str,
                            input: UserDeleteLabelsIn,
                            db: Annotated[Database, Depends(mongo_db_client)]) -> mongodb_model.User:
    db.users.update_one(
        {"id": user_id},
        {"$pullAll": {"labels": [x for x in input.labels if x.id == label_id]}}
    )

    return get_user_by_id(user_id, db)


def get_user_by_id(id: str, db: Database) -> mongodb_model.User:
    user = db.users.find_one({"id": f"{id}"})
    if not user:
        raise HTTPException(status_code=404, detail="Could not find user")
    return mongodb_model.User.from_dict(user)
