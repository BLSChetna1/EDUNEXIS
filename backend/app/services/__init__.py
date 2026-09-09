"""
Business Logic & Service Layer
Decouples API route controllers from direct third-party or AI model implementations.
"""

import asyncio
import sys
from pathlib import Path
from typing import Dict, Any

from app.core.config import settings

AI_ENGINE_PATH = Path(__file__).resolve().parents[3] / "ai-engine"
if str(AI_ENGINE_PATH) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_PATH))

from language.detector import LanguageDetector
from language.capabilities import SUPPORTED_LANGUAGE_CAPABILITIES
from pedagogy.simplifier import PedagogySimplifier
from prompts.templates import SYSTEM_TUTOR_PROMPT
from services.llm_service import get_llm_service


class AiPipelineError(RuntimeError):
    """Raised when the existing AI pipeline cannot produce a valid response."""


language_detector = LanguageDetector()
pedagogy_simplifier = PedagogySimplifier()
llm_service = get_llm_service("mock")


class BackendAiService:
    """Service bridge to AI Engine capabilities."""

    @staticmethod
    async def process_chat(
        message: str,
        target_lang: str,
        pedagogy_level: str,
        session_id: str | None = None,
    ) -> Dict[str, Any]:
        """Run a text or voice transcript through the shared AI-engine pipeline."""
        normalized_message = message.strip()
        if not normalized_message:
            raise ValueError("message must contain non-whitespace text")

        detected = language_detector.detect(normalized_message)
        detected_capabilities = SUPPORTED_LANGUAGE_CAPABILITIES.get(detected["language"], {})
        pedagogy = pedagogy_simplifier.simplify(normalized_message, pedagogy_level)
        system_instruction = SYSTEM_TUTOR_PROMPT.format(
            level=pedagogy["target_level"],
            target_language=target_lang,
        )
        prompt = (
            "Answer the student's educational question for a voice conversation. "
            "Be concise, conversational, and accurate. Use this order when useful: "
            "direct answer, short explanation, simple example, and one follow-up question. "
            "Keep the response under 120 words.\n\n"
            f"Student question: {normalized_message}\n"
            f"Pedagogy guidance: {pedagogy['level_description']}"
        )

        try:
            result = await asyncio.wait_for(
                llm_service.generate_response(
                    prompt=prompt,
                    system_instruction=system_instruction,
                    max_tokens=256,
                ),
                timeout=settings.LLM_TIMEOUT_SECONDS,
            )
        except asyncio.TimeoutError as error:
            raise TimeoutError("AI response timed out") from error
        except Exception as error:
            raise AiPipelineError("AI response could not be generated") from error

        reply = result.get("text") if isinstance(result, dict) else None
        if not isinstance(reply, str) or not reply.strip():
            raise AiPipelineError("AI returned an invalid response")

        return {
            "reply": reply.strip(),
            "pedagogy_level": pedagogy["target_level"],
            "detected_language": detected["language"],
            "metadata": {
                "model": result.get("model", settings.LLM_MODEL),
                "tokens_used": result.get("usage", {}).get("total_tokens", 0),
                "session_id": session_id,
                "voice_optimized": True,
                "language_support_status": detected_capabilities.get("support_status", "unavailable"),
            },
        }


from app.services.translation_service import TranslationService, TranslationError


class SpeechService:
    """Service bridge to STT and TTS APIs."""

    @staticmethod
    async def speech_to_text(audio_base64: str, lang: str, audio_format: str = "wav") -> Dict[str, Any]:
        """Placeholder STT."""
        return {
            "transcript": "Hello from EDUNEXIS speech transcription placeholder.",
            "confidence": 0.95,
            "detected_language": lang,
            "audio_format": audio_format,
        }

    @staticmethod
    async def text_to_speech(text: str, target_lang: str, voice_gender: str = "female") -> Dict[str, Any]:
        """Placeholder TTS."""
        return {
            "audio_base64": "",  # Placeholder base64 string
            "audio_format": "mp3",
            "duration_seconds": 1.5,
            "voice_gender": voice_gender,
        }
