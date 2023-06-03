from dataclasses import dataclass

@dataclass
class Action:
    timestamp: float
    action: str

@dataclass
class Session:
    user: str
    actions: list[Action]

