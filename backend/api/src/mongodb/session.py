from uuid import UUID

from pydantic import BaseModel


class StopwatchTime(BaseModel):
    hours: int
    minutes: int
    seconds: int


class Action(BaseModel):
    timestamp: float
    stopwatch_time: StopwatchTime
    event: str


class Session(BaseModel):
    id: str
    title: str
    user_id: str
    labels: list[str]
    actions: list[Action]

    @classmethod
    def from_dict(cls, d: dict):
        return cls(
            id=d["id"],
            title=d["title"],
            user_id=d["user_id"],
            labels=d["labels"],
            actions=[Action(**a) for a in d["actions"]]
        )
