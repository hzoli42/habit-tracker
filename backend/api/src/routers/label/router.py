import dataclasses
from typing import Annotated, Callable
from fastapi import APIRouter, Depends, HTTPException
from mypy_boto3_dynamodb import DynamoDBClient
from pymongo.database import Database

from api.src.dependencies import dynamodb_client, uuid_generator
from api.src.routers.label.model import DeleteLabelIn, GetLabelIn, NewLabelIn, UpdateLabelIn
from api.src.db_models.label import Label

router = APIRouter()
TABLE_NAME = "labels"


@router.post("/labels/new")
def new_label(
        input: NewLabelIn,
        db: Annotated[DynamoDBClient, Depends(dynamodb_client)],
        get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> Label:
    label_id = get_uuid()
    document = Label(
        label_id=label_id,
        user_id=input.user_id,
        name=input.name,
        color=input.color
    )

    # db.labels.insert_one(document.model_dump())
    db.put_item(TableName=TABLE_NAME, Item=document.model_dump())
    return get_label_by_id(input.user_id, label_id, db)


@router.get("/labels/{label_id}")
def user_get_label_by_id(
        label_id: str,
        input: GetLabelIn,
        db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> Label:
    return get_label_by_id(input.user_id, label_id, db)


@router.post("/labels/{label_id}")
def update_label(
        label_id: str,
        input: UpdateLabelIn,
        db: Annotated[DynamoDBClient, Depends(dynamodb_client)],
        get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> Label:
    _ = get_label_by_id(input.user_id, label_id, db)

    # db.labels.update_one(
    #     {"id": label_id},
    #     {"$set": {"name": input.name, "color": input.color}}
    # )

    db.update_item(
        TableName=TABLE_NAME,
        Key={"user_id": input.user_id, "session_id": label_id},
        UpdateExpression="SET name = :new_name, color = :new_color",
        ExpressionAttributeValues={
            ':new_name': input.name,
            ':new_color': input.color
        }
    )

    return get_label_by_id(input.user_id, label_id, db)


@router.delete("/labels/{label_id}")
def user_delete_labels(label_id: str,
                       input: DeleteLabelIn,
                       db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> int:
    # _ = get_label_by_id(label_id, db)
    result = db.delete_item(
        TableName=TABLE_NAME,
        Key={"user_id": input.user_id, "session_id": label_id},
    )
    return len(result.keys())


@router.get("/labels/user/{user_id}")
def user_get_labels(user_id: str,
                    db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> list[Label]:
    labels = dynamodb_client.query(
        TableName=TABLE_NAME,
        KeyConditionExpression='user_id = :user_id',
        ExpressionAttributeValues={':user_id': user_id}
    )
    return [Label.from_dict(s) for s in labels["Items"]]


def get_label_by_id(user_id: str, label_id: str, db: DynamoDBClient) -> Label:
    label = db.get_item(
        TableName=TABLE_NAME,
        Key={"user_id": user_id, "session_id": label_id}
    )

    if not label:
        raise HTTPException(status_code=404, detail="Could not find session")
    return Label.from_dict(label.get("Item"))
