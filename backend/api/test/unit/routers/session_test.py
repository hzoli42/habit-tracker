import sys
import unittest
from unittest import mock

from fastapi.testclient import TestClient
from mongomock import MongoClient
from api.src.main import app
from api.src.dependencies import mongo_db_client, uuid_generator
from api.src.routers.session.model import SessionActionIn, SessionStartIn
from api.test.unit.utils import constant_uuid_generator, mock_mongo
from backend.api.src.mongodb.session import Action, Session, StopwatchTime


class TestSessionRouter(unittest.TestCase):
    def setUp(self) -> None:
        self.test_data = {
            "user_id": "test_user_id",
            "title": "test_title",
            "labels": ["foo", "bar"],
            "start_action": Action(
                timestamp=0.0,
                stopwatch_time=StopwatchTime(hours=0, minutes=0, seconds=0),
                action="start"
            ),
            "pause_action": Action(
                timestamp=1.0,
                stopwatch_time=StopwatchTime(hours=0, minutes=0, seconds=1),
                action="pause"
            ),
            "resume_action": Action(
                timestamp=2.0,
                stopwatch_time=StopwatchTime(hours=0, minutes=0, seconds=2),
                action="resume"
            ),
        }

        self.mock_mongo = mock_mongo()

        app.dependency_overrides[mongo_db_client] = lambda: self.mock_mongo
        app.dependency_overrides[uuid_generator] = constant_uuid_generator
        self.client = TestClient(app)

    def test_session_start(self) -> None:
        test_uuid = constant_uuid_generator()
        input = SessionStartIn(
            **self.test_data, action=self.test_data["start_action"])
        response = self.client.post("/session/start", json=input.dict())

        expected_object = Session(
            **self.test_data, id=test_uuid(), actions=[self.test_data["start_action"]])
        response_object = Session.from_dict(response.json())

        assert response.status_code == 200
        assert expected_object == response_object

    def test_session_action_pause(self) -> None:
        test_uuid = constant_uuid_generator()

        input = SessionStartIn(
            **self.test_data, action=self.test_data["start_action"])
        response = self.client.post("/session/start", json=input.dict())
        assert response.status_code == 200

        input = SessionActionIn(
            id=test_uuid(), action=self.test_data["pause_action"])
        response = self.client.post("/session/action", json=input.dict())

        expected_object = Session(
            **self.test_data, id=test_uuid(), actions=[self.test_data["start_action"], self.test_data["pause_action"]])
        response_object = Session.from_dict(response.json())

        assert response.status_code == 200
        assert expected_object == response_object


if __name__ == '__main__':
    unittest.main()
