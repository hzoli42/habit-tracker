import os
from dotenv import find_dotenv, load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

environments = {
    "dev": ".env/.env.dev",
    "prod": "./env/.env.prod",
    "lambda": "./env.env.lambda"
}

env_file = environments[os.getenv("HT_ENV") or "dev"]
load_dotenv(find_dotenv(env_file))


class Settings(BaseSettings):
    env_name: str = ""
    mongo_connection_string: str = ""
    mongo_db_name: str = ""

    model_config = SettingsConfigDict()


settings = Settings()
