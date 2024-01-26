from pydantic import BaseModel
from api.src.mongodb.session import Session, Action
from api.src.mongodb.user import LabelData

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
