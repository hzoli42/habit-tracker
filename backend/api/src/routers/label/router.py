from ast import Expression
import dataclasses
from typing import Annotated, Callable
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from mypy_boto3_dynamodb import DynamoDBClient
from pymongo.database import Database

from api.src.dependencies import dynamodb_client, uuid_generator
from api.src.routers.label.model import NewLabelIn, UpdateLabelIn
from api.src.db_models.label import Label

router = APIRouter()
TABLE_NAME = "labels"


@router.get("/label/user/{user_id}")
def user_get_labels(user_id: str,
                    db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> list[Label]:
    labels = db.query(
        TableName=TABLE_NAME,
        KeyConditionExpression='user_id = :user_id',
        ExpressionAttributeValues={':user_id': {"S": user_id}}
    )
    return [Label.from_dynamodb_item(s) for s in labels["Items"]]


@router.get("/label/{label_id}/user/{user_id}")
def user_get_label_by_id(
        label_id: str,
        user_id: str,
        db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> Label:
    return get_label_by_id(user_id, label_id, db)


@router.post("/label/user/{user_id}")
def new_label(
        user_id: str,
        input: NewLabelIn,
        db: Annotated[DynamoDBClient, Depends(dynamodb_client)],
        get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> Label:
    label_id = get_uuid()
    document = Label(
        label_id=label_id,
        user_id=user_id,
        name=input.name,
        color=input.color
    )

    db.put_item(TableName=TABLE_NAME, Item=document.to_dynamodb_item())
    return get_label_by_id(user_id, label_id, db)


@router.post("/label/{label_id}/user/{user_id}")
def update_label(
    label_id: str,
    user_id: str,
    input: UpdateLabelIn,
    db: Annotated[DynamoDBClient, Depends(dynamodb_client)],
) -> Label:

    db.update_item(
        TableName=TABLE_NAME,
        Key={"user_id": {"S": user_id}, "label_id": {"S": label_id}},
        UpdateExpression="SET #label_name = :new_name, color = :new_color",
        ExpressionAttributeValues={
            ':new_name': {"S": input.name},
            ':new_color': {"S": input.color}
        },
        ExpressionAttributeNames={
            "#label_name": "name"
        }
    )

    return get_label_by_id(user_id, label_id, db)


@router.delete("/labels/{label_id}/user/{user_id}")
def user_delete_labels(label_id: str,
                       user_id: str,
                       db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> int:
    result = db.delete_item(
        TableName=TABLE_NAME,
        Key={"user_id": {"S": user_id}, "label_id": {"S": label_id}}
    )
    return len(result.keys())


def get_label_by_id(user_id: str, label_id: str, db: DynamoDBClient) -> Label:
    label = db.get_item(
        TableName=TABLE_NAME,
        Key={"user_id": {"S": user_id}, "label_id": {"S": label_id}}
    )

    if not label:
        raise HTTPException(status_code=404, detail="Could not find label")
    return Label.from_dynamodb_item(label.get("Item"))
