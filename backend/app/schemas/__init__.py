"""
Pydantic Schemas for Request & Response Validation
Aligned with docs/API_CONTRACT.md
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator


# --- Health & Root Schemas ---
class HealthResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "healthy"})
    version: str = Field(..., json_schema_extra={"example": "1.0.0"})
    environment: str = Field(..., json_schema_extra={"example": "development"})


class RootResponse(BaseModel):
    message: str = Field(..., json_schema_extra={"example": "Welcome to EDUNEXIS API"})
    docs_url: str = Field(..., json_schema_extra={"example": "/docs"})
    version: str = Field(..., json_schema_extra={"example": "1.0.0"})


# --- Chat & Pedagogy Schemas ---
class ChatRequest(BaseModel):
    message: str = Field(..., description="Student input query or topic")
    target_language: Optional[str] = Field("en", description="ISO 639-1 language code")
    pedagogy_level: Optional[str] = Field("standard", description="standard, beginner, intermediate, or advanced")
    session_id: Optional[str] = Field(None, description="Session tracking ID")

    @field_validator("message")
    @classmethod
    def message_must_contain_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("message must contain non-whitespace text")
        return normalized


class ChatResponse(BaseModel):
    reply: str
    pedagogy_level: str
    detected_language: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


# --- Language Detection Schemas ---
class LanguageDetectRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Input text to detect language for")


class LanguageDetectResponse(BaseModel):
    language: str
    language_code: Optional[str] = None
    regional_variant: Optional[str] = None
    confidence: float
    is_supported: bool
    support_status: Optional[str] = None


# Supported Translation Languages (Member 3 - EDUNEXIS)
SUPPORTED_TRANSLATION_LANGUAGES = {
    "en": "English",
    "te": "Telugu",
    "hi": "Hindi",
    "ta": "Tamil",
    "kn": "Kannada",
    "ml": "Malayalam",
    "bn": "Bengali",
    "mr": "Marathi",
    "gu": "Gujarati",
}


# --- Translation Schemas ---
class TranslateRequest(BaseModel):
    text: str = Field(
        ...,
        description="Text content to translate",
        json_schema_extra={"example": "Hello, how are you?"},
    )
    source_language: Optional[str] = Field(
        "auto",
        description="Source language code ('en', 'te', 'hi', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', or 'auto')",
        json_schema_extra={"example": "en"},
    )
    target_language: str = Field(
        ...,
        description="Target language code ('en', 'te', 'hi', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu')",
        json_schema_extra={"example": "te"},
    )

    @field_validator("text")
    @classmethod
    def validate_text(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Text cannot be empty or whitespace only.")
        return v.strip()

    @field_validator("source_language")
    @classmethod
    def validate_source_language(cls, v: Optional[str]) -> str:
        if v is None:
            return "auto"
        clean = v.strip().lower()
        if not clean:
            return "auto"
        if clean != "auto" and clean not in SUPPORTED_TRANSLATION_LANGUAGES:
            supported = ", ".join(SUPPORTED_TRANSLATION_LANGUAGES.keys())
            raise ValueError(
                f"Unsupported source language '{v}'. Supported languages: {supported}, auto"
            )
        return clean

    @field_validator("target_language")
    @classmethod
    def validate_target_language(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Target language is required.")
        clean = v.strip().lower()
        if clean not in SUPPORTED_TRANSLATION_LANGUAGES:
            supported = ", ".join(SUPPORTED_TRANSLATION_LANGUAGES.keys())
            raise ValueError(
                f"Unsupported target language '{v}'. Supported languages: {supported}"
            )
        return clean


class TranslateResponse(BaseModel):
    translated_text: str = Field(
        ...,
        description="Translated text in target language",
        json_schema_extra={"example": "హలో, మీరు ఎలా ఉన్నారు?"},
    )
    source_language: str = Field(
        ...,
        description="Resolved source language code",
        json_schema_extra={"example": "en"},
    )
    target_language: str = Field(
        ...,
        description="Target language code",
        json_schema_extra={"example": "te"},
    )


# --- Speech Schemas ---
class SpeechToTextRequest(BaseModel):
    audio_base64: str = Field(..., min_length=1, description="Base64 encoded audio payload")
    audio_format: Optional[str] = Field("wav", description="Audio format (e.g. wav, mp3)")
    language_code: Optional[str] = Field("auto", description="Expected language code or 'auto'")


class SpeechToTextResponse(BaseModel):
    transcript: str
    confidence: float
    detected_language: Optional[str] = None


class TextToSpeechRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to synthesize into speech")
    target_language: str = Field(..., description="Target language code")
    voice_gender: Optional[str] = Field("female", description="Voice profile gender/style")


class TextToSpeechResponse(BaseModel):
    audio_base64: str
    audio_format: str
    duration_seconds: Optional[float] = None
