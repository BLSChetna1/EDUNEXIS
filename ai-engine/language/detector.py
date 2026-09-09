"""
Language Detection & Identification Module
Provides fast script-based heuristics and placeholder language model detectors.
"""

from typing import Dict, Any


class LanguageDetector:
    """Detects primary language of text input with specialized Indic script support."""

    # Unicode script ranges for popular Indian scripts
    SCRIPT_RANGES = {
        "hi": (0x0900, 0x097F),  # Devanagari (Hindi, Marathi, Sanskrit)
        "bn": (0x0980, 0x09FF),  # Bengali
        "pa": (0x0A00, 0x0A7F),  # Gurmukhi (Punjabi)
        "gu": (0x0A80, 0x0AFF),  # Gujarati
        "ta": (0x0B80, 0x0BFF),  # Tamil
        "te": (0x0C00, 0x0C7F),  # Telugu
        "kn": (0x0C80, 0x0CFF),  # Kannada
        "ml": (0x0D00, 0x0D7F),  # Malayalam
    }

    def detect(self, text: str) -> Dict[str, Any]:
        """
        Detect the language code and confidence score.
        Uses unicode character code inspection as an efficient offline heuristic.
        """
        if not text or not text.strip():
            return {"language": "en", "confidence": 0.0, "is_supported": False}

        counts = {lang: 0 for lang in self.SCRIPT_RANGES}
        total_indic = 0

        for char in text:
            cp = ord(char)
            for lang, (start, end) in self.SCRIPT_RANGES.items():
                if start <= cp <= end:
                    counts[lang] += 1
                    total_indic += 1
                    break

        if total_indic > 0:
            top_lang = max(counts, key=counts.get)
            confidence = min(0.99, counts[top_lang] / max(1, len(text.strip())))
            return {
                "language": top_lang,
                "confidence": round(confidence, 2),
                "is_supported": True,
            }

        # Default fallback to English for Latin alphabet
        return {
            "language": "en",
            "confidence": 0.95,
            "is_supported": True,
        }
