from dataclasses import dataclass


@dataclass
class User:
    id: str
    email: str
    name: str