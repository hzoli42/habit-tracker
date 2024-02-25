import dataclasses
from typing import Annotated, Callable
from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from api.src.dependencies import mongo_db_client, uuid_generator
from api.src.routers.label.model import NewLabelIn, UpdateLabelIn
from api.src.db_models.label import Label

router = APIRouter()


@router.post("/labels/new")
def new_label(
        input: NewLabelIn,
        db: Annotated[Database, Depends(mongo_db_client)],
        get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> Label:
    label_id = get_uuid()
    document = Label(
        id=label_id,
        user_id=input.user_id,
        name=input.name,
        color=input.color
    )

    db.labels.insert_one(document.model_dump())
    return get_label_by_id(label_id, db)


@router.get("/labels/{label_id}")
def user_get_label_by_id(
        label_id: str,
        db: Annotated[Database, Depends(mongo_db_client)]) -> Label:
    return get_label_by_id(label_id, db)


@router.post("/labels/{label_id}")
def update_label(
        label_id: str,
        input: UpdateLabelIn,
        db: Annotated[Database, Depends(mongo_db_client)],
        get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> Label:
    _ = get_label_by_id(label_id, db)

    db.labels.update_one(
        {"id": label_id},
        {"$set": {"name": input.name, "color": input.color}}
    )

    return get_label_by_id(label_id, db)


@router.delete("/labels/{label_id}")
def user_delete_labels(label_id: str,
                       db: Annotated[Database, Depends(mongo_db_client)]) -> int:
    _ = get_label_by_id(label_id, db)
    result = db.labels.delete_one({"id": label_id})

    return result.deleted_count


@router.get("/labels/user/{user_id}")
def user_get_labels(user_id: str,
                    db: Annotated[Database, Depends(mongo_db_client)]) -> list[Label]:
    labels = db.labels.find({"user_id": user_id})
    result = []
    for l in [l for l in labels if 'id' in l]:
        result.append(Label.from_dict(l))
    return result


def get_label_by_id(id: str, db: Database) -> Label:
    label = db.labels.find_one({"id": f"{id}"})
    if not label:
        raise HTTPException(status_code=404, detail="Could not find session")
    return Label.from_dict(label)
