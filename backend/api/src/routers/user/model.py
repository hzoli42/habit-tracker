from dataclasses import dataclass


@dataclass
class UserNewIn:
    id: str
    name: str
    email: str
    nickname: str


@dataclass
class UserAddLabelsIn:
    id: str
    labels: list[str]


@dataclass
class UserDeleteLabelsIn:
    id: str
    labels: list[str]


@dataclass
class UserGetLabelsOut:
    id: str
    labels: list[str]
