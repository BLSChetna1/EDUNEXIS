"""
Pydantic Schemas for Request & Response Validation
Aligned with docs/API_CONTRACT.md
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


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
    confidence: float
    is_supported: bool


# --- Translation Schemas ---
class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text content to translate")
    source_language: Optional[str] = Field("auto", description="Source ISO code or 'auto'")
    target_language: str = Field(..., description="Target ISO code")


class TranslateResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str


# --- Speech Schemas ---
class SpeechToTextRequest(BaseModel):
    audio_base64: str = Field(..., description="Base64 encoded audio payload")
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
