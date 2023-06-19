from dataclasses import dataclass

from uuid import UUID

@dataclass
class Action:
    timestamp: float
    action: str

@dataclass
class Session:
    id: UUID
    title: str
    user_id: str
    tags: list[str]
    actions: list[Action]

