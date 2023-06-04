from dataclasses import dataclass
from uuid import UUID
from mongodb.session import Session

#######################################################################################################################

@dataclass
class PostSessionsStartRequest:
    user: str

@dataclass
class PostSessionsPauseRequest:
    id: UUID

@dataclass
class PostSessionsResumeRequest:
    id: UUID

@dataclass
class PostSessionsStopRequest:
    id: UUID


@dataclass 
class GetSessionsResponse:
    sessions: list[Session]

    