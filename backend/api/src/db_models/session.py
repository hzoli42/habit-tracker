from uuid import UUID

from pydantic import BaseModel


class Action(BaseModel):
    timestamp: float
    event: str


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
