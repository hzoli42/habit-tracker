from dataclasses import dataclass

from uuid import UUID

@dataclass
class Action:
    timestamp: float
    action: str

@dataclass
class Session:
    id: UUID
    user: str
    actions: list[Action]

