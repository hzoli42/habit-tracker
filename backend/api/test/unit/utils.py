from typing import Callable
from unittest.mock import MagicMock, Mock
from uuid import UUID
from mongomock import MongoClient
from pymongo.database import Database


def mock_mongo() -> Database:
    return MongoClient(uuidRepresentation='standard').get_database("test")


def constant_uuid_generator() -> Callable[[], str]:
    def generate_constant_uuid():
        constant_uuid = UUID(int=1)
        return constant_uuid.hex
    return generate_constant_uuid
