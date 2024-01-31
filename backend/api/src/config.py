from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongo_connection_string: str = ""
    mongo_db_name: str = ""

    model_config = SettingsConfigDict(env_file="./api/src/.env")


settings = Settings()
