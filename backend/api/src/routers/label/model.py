from pydantic import BaseModel

from api.src.db_models.label import Label


class NewLabelIn(BaseModel):
    name: str
    color: str


class UpdateLabelIn(BaseModel):
    name: str
    color: str
