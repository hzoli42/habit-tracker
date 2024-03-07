from uuid import UUID

from pydantic import BaseModel


# class Action(BaseModel):
#     timestamp: float
#     event: str

#     @classmethod
#     def from_dynamodb_item(cls, d: dict):
#         return cls(
#             timestamp=float(d["timestamp"]["N"]),
#             event=d["event"]["S"]
#         )

#     def to_dynamodb_item(self):
#         return {
#             "timestamp": {"N": str(self.timestamp)},
#             "event": {"S": self.event}
#         }


class Session(BaseModel):
    session_id: str
    title: str
    user_id: str
    label_id: str
    start_time: float
    end_time: float

    @classmethod
    def from_dict(cls, d: dict):
        return cls(
            session_id=d["session_id"],
            title=d["title"],
            user_id=d["user_id"],
            label_id=d["label_id"],
            start_time=float(d["start_time"]),
            end_time=float(d["end_time"])
        )

    @classmethod
    def from_dynamodb_item(cls, d: dict):
        return cls(
            session_id=d["session_id"]["S"],
            title=d["title"]["S"],
            user_id=d["user_id"]["S"],
            label_id=d["label_id"]["S"],
            start_time=float(d["start_time"]["N"]),
            end_time=float(d["end_time"]["N"])
        )

    def to_dynamodb_item(self):
        return {
            "session_id": {"S": self.session_id},
            "title": {"S": self.title},
            "user_id": {"S": self.user_id},
            "label_id": {"S": self.label_id},
            "start_time": {"N": str(self.start_time)},
            "end_time": {"N": str(self.start_time)}
        }
