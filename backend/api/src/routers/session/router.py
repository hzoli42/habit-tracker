
from typing import Annotated, Callable
from fastapi import APIRouter, Depends, HTTPException
from mypy_boto3_dynamodb import DynamoDBClient
import pymongo
from .model import SessionActionIn, SessionAllOut, SessionDeleteIn, SessionGetIn, SessionModifyIn, SessionStartIn
from api.src.dependencies import dynamodb_client, uuid_generator

import api.src.db_models.session as db_model
from pymongo.database import Database


router = APIRouter()
TABLE_NAME = "sessions"


@router.post("/session/start")
async def start_session(input: SessionStartIn,
                        db: Annotated[DynamoDBClient, Depends(dynamodb_client)],
                        get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> db_model.Session:
    session_id = get_uuid()
    document = db_model.Session(
        session_id=session_id,
        user_id=input.user_id,
        actions=[input.action],
        title=input.title,
        label_id=input.label_id
    )

    # db.sessions.insert_one(document.model_dump())
    db.put_item(TableName=TABLE_NAME, Item=document.model_dump())
    return get_session_by_id(input.user_id, session_id, db)


@router.post("/session/stop")
async def action_session(input: SessionActionIn,
                         db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> db_model.Session:
    current_session = get_session_by_id(input.user_id, input.session_id, db)
    last_action = current_session.actions[-1]
    if last_action.event != "start":
        raise HTTPException(
            status_code=400, detail="STOP event must be directly preceded by a START event")

    # db.sessions.update_one(
    #     {"id": input.id},
    #     {"$push": {"actions": input.action.model_dump()}}
    # )
    db.update_item(
        TableName=TABLE_NAME,
        Key={"user_id": input.user_id, "session_id": input.session_id},
        UpdateExpression="SET actions = list_append(actions, :new_action)",
        ExpressionAttributeValues={':new_action': [input.action.model_dump()]}
    )

    return get_session_by_id(input.user_id, input.session_id, db)


@router.get("/session/{session_id}")
async def get_session(session_id: str,
                      input: SessionGetIn,
                      db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> db_model.Session:
    return get_session_by_id(input.user_id, session_id, db)


@router.post("/session/{session_id}")
async def modify_session(session_id: str,
                         input: SessionModifyIn,
                         db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> db_model.Session:
    db.update_item(
        TableName=TABLE_NAME,
        Key={"user_id": input.user_id, "session_id": session_id},
        UpdateExpression="SET title = :new_title, label_id = :new_label_id",
        ExpressionAttributeValues={
            ':new_title': input.title,
            ':new_label_id': input.label_id
        }
    )
    return get_session_by_id(input.user_id, session_id, db)


@router.delete("/session/{session_id}")
async def delete_session(session_id: str,
                         input: SessionDeleteIn,
                         db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> int:
    # result = db.sessions.delete_one({"id": id})
    result = db.delete_item(
        TableName=TABLE_NAME,
        Key={"user_id": input.user_id, "session_id": session_id},
    )
    return len(result.keys())


@router.get("/session/user/{user_id}")
async def user_all_session(user_id: str,
                           db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> list[db_model.Session]:
    # sessions = db.get_item(
    #     TableName="sessions",
    #     Key={"user_id": user_id},
    # )

    sessions = dynamodb_client.query(
        TableName=TABLE_NAME,
        KeyConditionExpression='user_id = :user_id',
        ExpressionAttributeValues={':user_id': user_id}
    )
    return [db_model.Session.from_dict(s) for s in sessions["Items"]]


def get_session_by_id(user_id: str, session_id, db: DynamoDBClient) -> db_model.Session:
    session = db.get_item(
        TableName=TABLE_NAME,
        Key={"user_id": input.user_id, "session_id": input.session_id},
    )

    if not session:
        raise HTTPException(status_code=404, detail="Could not find session")
    return db_model.Session.from_dict(session.get("Item"))
