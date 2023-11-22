import sys
import unittest

from fastapi.testclient import TestClient
from api.src.main import app
from api.src.dependencies import mongo_db_client
from api.src.routers.session.model import SessionStartIn
from api.test.unit.utils import db_override_mongo


# class TestSessionRouter(unittest.TestCase):
# def setUp(self) -> None:
# app.dependency_overrides[mongo_db_client] = db_override_mongo
# self.client = TestClient(app)

# def test_session_start(self) -> None:
#     input = SessionStartIn(user_id="test_user_id",
#                            title="test_title", labels=["foo", "bar"])


if __name__ == '__main__':
    print(sys.path)
    unittest.main()
