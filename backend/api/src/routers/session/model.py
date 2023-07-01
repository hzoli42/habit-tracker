from dataclasses import dataclass, field
from uuid import UUID
from mongodb.session import Session, Action

#######################################################################################################################

@dataclass
class PostSessionsStartRequest:
    user_id: str
    title: str
    labels: list[str]

@dataclass
class PostSessionsStartResponse:
    id: UUID

# @dataclass
# class PostSessionsPauseRequest:
#     id: UUID

# @dataclass
# class PostSessionsResumeRequest:
#     id: UUID

@dataclass
class PostSessionsStopRequest:
    id: UUID
    actions: list[Action]


@dataclass 
class GetSessionsResponse:
    sessions: list[Session]

    