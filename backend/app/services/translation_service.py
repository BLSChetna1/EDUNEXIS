"""
EDUNEXIS Translation Service (Member 3 - Translation Module)
Translates educational content between English and Indian regional languages:
- English (en)
- Telugu (te)
- Hindi (hi)
- Tamil (ta)
- Kannada (kn)
- Malayalam (ml)
- Bengali (bn)
- Marathi (mr)
- Gujarati (gu)
"""

import logging
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger("edunexis.translation")

# Canonical dictionary of supported languages
SUPPORTED_LANGUAGES: Dict[str, str] = {
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


class TranslationError(Exception):
    """Raised when translation fails."""
    pass


class TranslationService:
    """
    Asynchronous, reliable Translation Service for EDUNEXIS.
    Uses httpx to perform high-speed translation across English and Indian regional languages.
    """

    TRANSLATION_API_URL = "https://clients5.google.com/translate_a/t"

    @classmethod
    def get_supported_languages(cls) -> Dict[str, str]:
        """Return supported ISO 639-1 language codes and language names."""
        return SUPPORTED_LANGUAGES

    @classmethod
    async def translate(
        cls,
        text: str,
        source_lang: str = "auto",
        target_lang: str = "en",
    ) -> Dict[str, str]:
        """
        Translate input text from source_lang to target_lang.

        :param text: Non-empty string to translate.
        :param source_lang: Source ISO code or 'auto'.
        :param target_lang: Target ISO code.
        :return: Dict containing translated_text, source_language, target_language.
        :raises ValueError: If validation fails.
        :raises TranslationError: If translation engine encounters an error.
        """
        clean_text = text.strip() if text else ""
        if not clean_text:
            raise ValueError("Text cannot be empty or whitespace only.")

        clean_source = (source_lang or "auto").strip().lower()
        clean_target = (target_lang or "").strip().lower()

        if not clean_target:
            raise ValueError("Target language is required.")

        if clean_target not in SUPPORTED_LANGUAGES:
            supported = ", ".join(SUPPORTED_LANGUAGES.keys())
            raise ValueError(f"Unsupported target language '{target_lang}'. Supported: {supported}")

        if clean_source != "auto" and clean_source not in SUPPORTED_LANGUAGES:
            supported = ", ".join(SUPPORTED_LANGUAGES.keys())
            raise ValueError(f"Unsupported source language '{source_lang}'. Supported: {supported}, auto")

        # Identity optimization
        if clean_source == clean_target:
            return {
                "translated_text": clean_text,
                "source_language": clean_source,
                "target_language": clean_target,
            }

        sl = clean_source if clean_source != "auto" else "auto"
        params = {
            "client": "dict-chrome-ex",
            "sl": sl,
            "tl": clean_target,
            "q": clean_text,
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(cls.TRANSLATION_API_URL, params=params, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list) and len(data) > 0:
                        translated_text = " ".join(str(item) for item in data if item)
                        return {
                            "translated_text": translated_text,
                            "source_language": clean_source if clean_source != "auto" else "en",
                            "target_language": clean_target,
                        }
                raise TranslationError(f"Translation API returned HTTP {response.status_code}")
        except ValueError:
            raise
        except Exception as err:
            logger.error(f"Translation error: {err}")
            raise TranslationError(f"Translation failed: {str(err)}")
