
from typing import Annotated, Callable
from fastapi import APIRouter, Depends, HTTPException
from mypy_boto3_dynamodb import DynamoDBClient
from api.src.dependencies import dynamodb_client, uuid_generator
from api.src.routers.session.model import EventStopSessionIn, NewSessionIn, UpdateSessionIn
from api.src.config import settings

from api.src.db_models.session import Session


router = APIRouter()
TABLE_NAME = settings.dynamodb_sessions_table
print(TABLE_NAME)


@router.get("/session/user/{user_id}")
async def user_all_session(user_id: str,
                           db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> list[Session]:

    sessions = db.query(
        TableName=TABLE_NAME,
        KeyConditionExpression='user_id = :user_id',
        ExpressionAttributeValues={':user_id': {"S": user_id}}
    )
    return [Session.from_dynamodb_item(s) for s in sessions["Items"]]


@router.get("/session/{session_id}/user/{user_id}")
async def get_session(session_id: str,
                      user_id: str,
                      db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> Session:
    return get_session_by_id(user_id, session_id, db)


@router.post("/session/user/{user_id}")
async def new_session(user_id: str,
                      input: NewSessionIn,
                      db: Annotated[DynamoDBClient, Depends(dynamodb_client)],
                      get_uuid: Annotated[Callable[[], str], Depends(uuid_generator)]) -> Session:
    session_id = get_uuid()
    document = Session(
        session_id=session_id,
        user_id=user_id,
        title=input.title,
        label_id=input.label_id,
        start_time=input.start_time,
        end_time=-1
    )

    db.put_item(TableName=TABLE_NAME, Item=document.to_dynamodb_item())
    return get_session_by_id(user_id, session_id, db)


@router.post("/session/{session_id}/user/{user_id}/event/stop")
async def event_stop_session(session_id: str,
                             user_id: str,
                             input: EventStopSessionIn,
                             db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> Session:
    db.update_item(
        TableName=TABLE_NAME,
        Key={"user_id": {"S": user_id}, "session_id": {"S": session_id}},
        UpdateExpression="SET end_time = :new_end",
        ExpressionAttributeValues={
            ':new_end': {"N": str(input.end_time)}
        }
    )
    return get_session_by_id(user_id, session_id, db)


@router.post("/session/{session_id}/user/{user_id}")
async def update_session(session_id: str,
                         user_id: str,
                         input: UpdateSessionIn,
                         db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> Session:
    db.update_item(
        TableName=TABLE_NAME,
        Key={"user_id": {"S": user_id}, "session_id": {"S": session_id}},
        UpdateExpression="SET title = :new_title, label_id = :new_label_id, start_time = :new_start, end_time = :new_end",
        ExpressionAttributeValues={
            ':new_title': {"S": input.title},
            ':new_label_id': {"S": input.label_id},
            ':new_start': {"N": str(input.start_time)},
            ':new_end': {"N": str(input.end_time)}
        }
    )
    return get_session_by_id(user_id, session_id, db)


@router.delete("/session/{session_id}/user/{user_id}")
async def delete_session(session_id: str,
                         user_id: str,
                         db: Annotated[DynamoDBClient, Depends(dynamodb_client)]) -> int:
    result = db.delete_item(
        TableName=TABLE_NAME,
        Key={"user_id": {"S": user_id}, "session_id": {"S": session_id}},
    )
    return len(result.keys())


def get_session_by_id(user_id: str, session_id, db: DynamoDBClient) -> Session:
    session = db.get_item(
        TableName=TABLE_NAME,
        Key={"user_id": {"S": user_id}, "session_id": {"S": session_id}},
    )

    if not session:
        raise HTTPException(status_code=404, detail="Could not find session")
    return Session.from_dynamodb_item(session.get("Item"))
