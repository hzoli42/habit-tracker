from pydantic import BaseModel
from api.src.db_models.session import Session

#######################################################################################################################


class NewSessionIn(BaseModel):
    title: str
    label_id: str
    start_time: float


class EventStopSessionIn(BaseModel):
    end_time: float


class UpdateSessionIn(BaseModel):
    title: str
    label_id: str
    start_time: float
    end_time: float
