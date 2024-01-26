from dataclasses import dataclass

from api.src.mongodb.user import LabelData


@dataclass
class UserNewIn:
    sub: str
    name: str
    email: str
    nickname: str


@dataclass
class UserUpdateLabelsIn:
    labels: list[LabelData]


@dataclass
class UserUpdateLabelsOut:
    labels: list[LabelData]


@dataclass
class UserDeleteLabelsIn:
    labels: list[LabelData]


@dataclass
class UserGetLabelsOut:
    id: str
    labels: list[LabelData]
