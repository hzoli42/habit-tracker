from uuid import UUID

from pydantic import BaseModel


class Action(BaseModel):
    timestamp: float
    event: str

    @classmethod
    def from_dynamodb_item(cls, d: dict):
        return cls(
            timestamp=float(d["timestamp"]["N"]),
            event=d["event"]["S"]
        )

    def to_dynamodb_item(self):
        return {
            "timestamp": {"N": str(self.timestamp)},
            "event": {"S": self.event}
        }


class Session(BaseModel):
    session_id: str
    title: str
    user_id: str
    label_id: str
    actions: list[Action]

    @classmethod
    def from_dict(cls, d: dict):
        return cls(
            session_id=d["session_id"],
            title=d["title"],
            user_id=d["user_id"],
            label_id=d["label_id"],
            actions=[Action(**a) for a in d["actions"]]
        )

    @classmethod
    def from_dynamodb_item(cls, d: dict):
        return cls(
            session_id=d["session_id"]["S"],
            title=d["title"]["S"],
            user_id=d["user_id"]["S"],
            label_id=d["label_id"]["S"],
            actions=[Action.from_dynamodb_item(
                a["M"]) for a in d["actions"]["L"]]
        )

    def to_dynamodb_item(self):
        return {
            "session_id": {"S": self.session_id},
            "title": {"S": self.title},
            "user_id": {"S": self.user_id},
            "label_id": {"S": self.label_id},
            "actions": {"L": [{"M": a.to_dynamodb_item()} for a in self.actions]}
        }
