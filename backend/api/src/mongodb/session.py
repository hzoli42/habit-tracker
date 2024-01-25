from uuid import UUID

from pydantic import BaseModel

from api.src.mongodb.user import LabelData


class Action(BaseModel):
    timestamp: float
    event: str


class Session(BaseModel):
    id: str
    title: str
    user_id: str
    label: LabelData
    actions: list[Action]

    @classmethod
    def from_dict(cls, d: dict):
        return cls(
            id=d["id"],
            title=d["title"],
            user_id=d["user_id"],
            label=LabelData(
                labelName=d["label"]["labelName"], labelColor=d["label"]["labelColor"]),
            actions=[Action(**a) for a in d["actions"]]
        )
