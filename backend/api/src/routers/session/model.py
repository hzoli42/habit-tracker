from pydantic import BaseModel
from api.src.mongodb.session import Session, Action

#######################################################################################################################


class SessionStartIn(BaseModel):
    user_id: str
    title: str
    labels: list[str]
    action: Action


class SessionActionIn(BaseModel):
    id: str
    action: Action


class SessionModifyIn(BaseModel):
    title: str
    labels: list[str]


class SessionAllOut(BaseModel):
    sessions: list[Session]
