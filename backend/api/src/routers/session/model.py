from pydantic import BaseModel
from uuid import UUID
from api.src.mongodb.session import Session, Action

#######################################################################################################################


class SessionStartIn(BaseModel):
    user_id: str
    title: str
    labels: list[str]


class SessionStartOut(BaseModel):
    id: UUID


class SessionStopIn(BaseModel):
    id: UUID
    actions: list[Action]


class SessionAllOut(BaseModel):
    sessions: list[Session]
