from dataclasses import dataclass


@dataclass
class User:
    id: str
    email: str
    name: str
    nickname: str
    labels: list[str]

    @classmethod
    def from_dict(cls, d: dict):
        return cls(
            id=d["id"],
            email=d["email"],
            name=d["name"],
            nickname=d["nickname"],
            labels=[str(x) for x in d["labels"]]
        )
