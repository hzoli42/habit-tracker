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

    @classmethod
    def from_dynamodb_item(cls, d: dict):
        return cls(
            label_id=d["label_id"]["S"],
            user_id=d["user_id"]["S"],
            name=d["name"]["S"],
            color=d["color"]["S"]
        )

    def to_dynamodb_item(self):
        return {
            "label_id": {"S": self.label_id},
            "user_id": {"S": self.user_id},
            "name": {"S": self.name},
            "color": {"S": self.color}
        }
