"""Speech processing routes (STT & TTS)."""
from fastapi import APIRouter, status
from app.schemas import (
    SpeechToTextRequest,
    SpeechToTextResponse,
    TextToSpeechRequest,
    TextToSpeechResponse,
)
from app.services import SpeechService

router = APIRouter(tags=["Speech Processing"])


@router.post("/speech-to-text", response_model=SpeechToTextResponse, status_code=status.HTTP_200_OK)
async def speech_to_text_endpoint(request: SpeechToTextRequest) -> SpeechToTextResponse:
    """
    Transcribe audio stream or base64 audio payload to text.
    """
    result = await SpeechService.speech_to_text(
        audio_base64=request.audio_base64,
        lang=request.language_code or "auto",
        audio_format=request.audio_format or "wav",
    )
    return SpeechToTextResponse(**result)


@router.post("/text-to-speech", response_model=TextToSpeechResponse, status_code=status.HTTP_200_OK)
async def text_to_speech_endpoint(request: TextToSpeechRequest) -> TextToSpeechResponse:
    """
    Synthesize text into natural sounding speech audio.
    """
    result = await SpeechService.text_to_speech(
        text=request.text,
        target_lang=request.target_language,
        voice_gender=request.voice_gender or "female",
    )
    return TextToSpeechResponse(**result)
