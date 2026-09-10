"""
Core Application Settings & Configuration
Loads environment variables safely without hardcoded secrets.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application metadata
    PROJECT_NAME: str = "EDUNEXIS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Server Port
    BACKEND_PORT: int = 8000

    # Frontend CORS Origins
    FRONTEND_URL: str = "http://localhost:5173"

    # Database Configuration (Placeholder - architecture ready)
    DATABASE_URL: str = ""

    # AI & NLP Service Configuration
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gemini-1.5-flash"
    LLM_TIMEOUT_SECONDS: float = 15.0

    # Multilingual & Speech APIs
    TRANSLATION_API_KEY: str = ""
    TRANSLATION_SUPPORTED_LANGUAGES: List[str] = [
        "en", "te", "hi", "ta", "kn", "ml", "bn", "mr", "gu"
    ]
    SPEECH_API_KEY: str = ""

    # Pydantic Settings Configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> List[str]:
        origins = [
            self.FRONTEND_URL,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
        ]
        return list(set(origins))


settings = Settings()
