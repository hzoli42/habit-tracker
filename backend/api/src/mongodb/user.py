from dataclasses import dataclass

from pydantic import BaseModel


class LabelData(BaseModel):
    labelName: str
    labelColor: str


class User(BaseModel):
    id: str
    email: str
    name: str
    nickname: str
    labels: list[LabelData]

    @classmethod
    def from_dict(cls, d: dict):
        return cls(
            id=d["id"],
            email=d["email"],
            name=d["name"],
            nickname=d["nickname"],
            labels=[LabelData(labelName=x["labelName"],
                              labelColor=x["labelColor"]) for x in d["labels"]]
        )
