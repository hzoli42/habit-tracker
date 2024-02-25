from typing import Callable
import typing
import uuid
from mypy_boto3_dynamodb import DynamoDBClient
from pymongo import MongoClient
from pymongo.database import Database
from api.src.config import settings
import boto3


async def dynamodb_client() -> DynamoDBClient:
    return boto3.client('dynamodb')


async def uuid_generator() -> Callable[[], str]:
    def generate_uuid() -> str:
        new_uuid = uuid.uuid4()
        return new_uuid.hex
    return generate_uuid
