from pydantic import BaseModel

from api.src.db_models.label import Label


class NewLabelIn(BaseModel):
    user_id: str
    name: str
    color: str


class UpdateLabelIn(BaseModel):
    name: str
    color: str
