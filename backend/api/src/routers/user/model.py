from dataclasses import dataclass


@dataclass
class UserNewIn:
    id: str
    name: str
    email: str
    nickname: str


@dataclass
class UserAddLabels:
    id: str
    labels: list[str]


@dataclass
class UserDeleteLabels:
    id: str
    labels: list[str]
