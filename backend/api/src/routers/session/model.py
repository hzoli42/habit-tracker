from pydantic import BaseModel
from api.src.db_models.session import Session, Action

#######################################################################################################################


class SessionStartIn(BaseModel):
    user_id: str
    title: str
    label_id: str
    action: Action


class SessionActionIn(BaseModel):
    user_id: str
    session_id: str
    action: Action


class SessionGetIn(BaseModel):
    user_id: str


class SessionModifyIn(BaseModel):
    user_id: str
    title: str
    label_id: str


class SessionDeleteIn(BaseModel):
    user_id: str


class SessionAllOut(BaseModel):
    sessions: list[Session]
