from dataclasses import dataclass

from api.src.mongodb.user import LabelData


@dataclass
class UserNewIn:
    id: str
    name: str
    email: str
    nickname: str


@dataclass
class UserAddLabelsIn:
    id: str
    labels: list[LabelData]


@dataclass
class UserDeleteLabelsIn:
    id: str
    labels: list[LabelData]


@dataclass
class UserGetLabelsOut:
    id: str
    labels: list[LabelData]
