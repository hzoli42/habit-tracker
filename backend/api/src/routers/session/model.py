from pydantic import BaseModel
from api.src.db_models.session import Session, Action

#######################################################################################################################


class NewSessionIn(BaseModel):
    title: str
    label_id: str
    action: Action


class UpdateSessionIn(BaseModel):
    title: str
    label_id: str
    action: Action
