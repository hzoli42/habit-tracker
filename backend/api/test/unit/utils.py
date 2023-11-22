from unittest.mock import Mock
from pymongo.database import Database


def db_override_mongo() -> Database:
    return Mock(spec=Database)
