import sys
import unittest
from unittest import mock

from fastapi.testclient import TestClient
from httpx import Response
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
            "stop_action": Action(
                timestamp=10.0,
                stopwatch_time=StopwatchTime(hours=0, minutes=0, seconds=10),
                action="stop"
            ),
        }

        self.mock_mongo = mock_mongo()

        app.dependency_overrides[mongo_db_client] = lambda: self.mock_mongo
        app.dependency_overrides[uuid_generator] = constant_uuid_generator
        self.client = TestClient(app)

    def test_start(self) -> None:
        test_uuid = constant_uuid_generator()

        response = self.send_action("start")
        response_object = Session.from_dict(response.json())

        expected_object = Session(
            **self.test_data, id=test_uuid(), actions=[self.test_data["start_action"]])

        assert response.status_code == 200
        assert expected_object == response_object

    def test_pause(self) -> None:
        test_uuid = constant_uuid_generator()

        _ = self.send_action("start")
        response = self.send_action("pause")
        response_object = Session.from_dict(response.json())

        expected_object = Session(
            **self.test_data, id=test_uuid(), actions=[self.test_data["start_action"],
                                                       self.test_data["pause_action"]])

        assert response.status_code == 200
        assert expected_object == response_object

    def test_resume(self) -> None:
        test_uuid = constant_uuid_generator()

        _ = self.send_action("start")
        _ = self.send_action("pause")
        response = self.send_action("resume")
        response_object = Session.from_dict(response.json())

        expected_object = Session(
            **self.test_data, id=test_uuid(), actions=[self.test_data["start_action"],
                                                       self.test_data["pause_action"],
                                                       self.test_data["resume_action"]])

        assert response.status_code == 200
        assert expected_object == response_object

    def test_stop(self) -> None:
        test_uuid = constant_uuid_generator()

        _ = self.send_action("start")
        _ = self.send_action("pause")
        _ = self.send_action("resume")
        response = self.send_action("stop")
        response_object = Session.from_dict(response.json())

        expected_object = Session(
            **self.test_data, id=test_uuid(), actions=[self.test_data["start_action"],
                                                       self.test_data["pause_action"],
                                                       self.test_data["resume_action"],
                                                       self.test_data["stop_action"]])

        assert response.status_code == 200
        assert expected_object == response_object

    def test_no_start_invalid(self) -> None:
        response = self.send_action("stop")

        assert response.status_code == 404
        assert response.json()["detail"] == "Could not find session"

    def test_after_stop_invalid(self) -> None:
        _ = self.send_action("start")
        _ = self.send_action("stop")
        response = self.send_action("pause")

        assert response.status_code == 400
        assert response.json()["detail"] == "Session has already ended"

    def test_resume_after_start_invalid(self) -> None:
        _ = self.send_action("start")
        response = self.send_action("resume")

        assert response.status_code == 400
        assert response.json()["detail"] == "Invalid order of actions"

    def test_resume_after_resume_invalid(self) -> None:
        _ = self.send_action("start")
        _ = self.send_action("resume")
        response = self.send_action("resume")

        assert response.status_code == 400
        assert response.json()["detail"] == "Invalid order of actions"

    def test_pause_after_pause_invalid(self) -> None:
        _ = self.send_action("start")
        _ = self.send_action("pause")
        response = self.send_action("pause")

        assert response.status_code == 400
        assert response.json()["detail"] == "Invalid order of actions"

    def send_action(self, action: str) -> Response:
        response = None
        if action == "start":
            input = SessionStartIn(
                **self.test_data, action=self.test_data["start_action"])
            response = self.client.post("/session/start", json=input.dict())
        else:
            test_uuid = constant_uuid_generator()
            input = SessionActionIn(
                id=test_uuid(), action=self.test_data[f"{action}_action"])
            response = self.client.post("/session/action", json=input.dict())
        return response


if __name__ == '__main__':
    unittest.main()
