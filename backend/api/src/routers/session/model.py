from pydantic import BaseModel
from api.src.db_models.session import Session, Action

#######################################################################################################################


class SessionStartIn(BaseModel):
    user_id: str
    title: str
    label_id: str
    action: Action


class SessionActionIn(BaseModel):
    id: str
    action: Action


class SessionModifyIn(BaseModel):
    title: str
    label_id: str


class SessionAllOut(BaseModel):
    sessions: list[Session]
