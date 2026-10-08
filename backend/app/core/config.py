"""
Application Settings & Configuration
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "FitTrack API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = ""

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # PostgreSQL Database URL (defaults to SQLite fallback for instant zero-dependency local running!)
    DATABASE_URL: str = "sqlite:///./fittrack_local.db"

    # Firebase Admin SDK Configuration
    FIREBASE_CREDENTIALS_PATH: str = ""

    CORS_ORIGINS: List[str] = ["*"]
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
