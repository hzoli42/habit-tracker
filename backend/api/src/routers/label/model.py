from pydantic import BaseModel

from api.src.mongodb.label import Label


class NewLabelIn(BaseModel):
    user_id: str
    name: str
    color: str


class UpdateLabelIn(BaseModel):
    name: str
    color: str
