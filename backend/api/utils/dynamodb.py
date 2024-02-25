from typing import Dict, List
import boto3


def create_table(name: str, key_schema: list[dict[str, str]], attribute_definitions: list[dict[str, str]]):
    """
    Creates a DynamoDB table.

    :param dyn_resource: Either a Boto3 or DAX resource.
    :return: The newly created table.
    """
    dyn_resource = boto3.resource("dynamodb")

    params = {
        "TableName": name,
        "KeySchema": key_schema,
        "AttributeDefinitions": attribute_definitions,
        "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 10},
    }
    table = dyn_resource.create_table(**params)
    print(f"Creating {name}...")
    table.wait_until_exists()
    return table


if __name__ == "__main__":
    labels_table = create_table(
        name="labels",
        key_schema=[
            {"AttributeName": "user", "KeyType": "HASH"},
            {"AttributeName": "label_id", "KeyType": "RANGE"},
        ],
        attribute_definitions=[
            {"AttributeName": "user", "AttributeType": "S"},
            {"AttributeName": "label_id", "AttributeType": "S"},
        ]
    )
    sessions_table = create_table(
        name="sessions",
        key_schema=[
            {"AttributeName": "user", "KeyType": "HASH"},
            {"AttributeName": "session_id", "KeyType": "RANGE"},
        ],
        attribute_definitions=[
            {"AttributeName": "user", "AttributeType": "S"},
            {"AttributeName": "session_id", "AttributeType": "S"},
        ]
    )
