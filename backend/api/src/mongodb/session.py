from dataclasses import dataclass

from uuid import UUID

@dataclass
class StopwatchTime:
    hours: int
    minutes: int
    seconds: int

@dataclass
class Action:
    timestamp: float
    stopwatch_time: StopwatchTime
    action: str

@dataclass
class Session:
    id: UUID
    title: str
    user_id: str
    labels: list[str]
    actions: list[Action]

