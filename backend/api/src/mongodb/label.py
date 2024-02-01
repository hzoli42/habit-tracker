from dataclasses import dataclass

from pydantic import BaseModel


class Label(BaseModel):
    id: str
    user_id: str
    name: str
    color: str

    @classmethod
    def from_dict(cls, d: dict):
        return cls(
            id=d["id"],
            user_id=d["user_id"],
            name=d["name"],
            color=d["color"]
        )
