from dataclasses import dataclass


@dataclass
class UserLoginIn:
    id: str
    name: str
    email: str

@dataclass
class UserLoginOut:
    id: str