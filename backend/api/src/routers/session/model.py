from dataclasses import dataclass, field
from uuid import UUID
from mongodb.session import Session

#######################################################################################################################

@dataclass
class PostSessionsStartRequest:
    user_id: str
    title: str = "Untitled Session"
    tags: list[str] = field(default_factory=list)

@dataclass
class PostSessionsStartResponse:
    id: UUID

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

    