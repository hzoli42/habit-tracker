from dataclasses import dataclass

from pydantic import BaseModel


class Label(BaseModel):
    label_id: str
    user_id: str
    name: str
    color: str

    @classmethod
    def from_dict(cls, d: dict):
        return cls(
            label_id=d["label_id"],
            user_id=d["user_id"],
            name=d["name"],
            color=d["color"]
        )
