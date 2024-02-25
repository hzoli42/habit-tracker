from pydantic import BaseModel

from api.src.db_models.label import Label


class NewLabelIn(BaseModel):
    user_id: str
    name: str
    color: str


class GetLabelIn(BaseModel):
    user_id: str


class DeleteLabelIn(BaseModel):
    user_id: str


class UpdateLabelIn(BaseModel):
    user_id: str
    name: str
    color: str
