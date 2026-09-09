"""
Unit Tests for AI Engine Modules
Validates language detection, pedagogical simplification, and LLM interfaces.
"""

import sys
import pytest
from pathlib import Path

# Add repo root to sys.path to enable imports from ai-engine
repo_root = Path(__file__).resolve().parent.parent.parent
ai_engine_path = repo_root / "ai-engine"
if str(ai_engine_path) not in sys.path:
    sys.path.insert(0, str(ai_engine_path))

from language.detector import LanguageDetector
from pedagogy.simplifier import PedagogySimplifier
from services.llm_service import MockLLMService, get_llm_service


def test_language_detector_english():
    detector = LanguageDetector()
    result = detector.detect("Hello and welcome to the class.")
    assert result["language"] == "en"
    assert result["is_supported"] is True


def test_language_detector_devanagari():
    detector = LanguageDetector()
    result = detector.detect("नमस्ते भारत")
    assert result["language"] == "hi"
    assert result["is_supported"] is True


def test_pedagogy_simplifier():
    simplifier = PedagogySimplifier()
    sample_text = "Photosynthesis is the process by which green plants transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds."
    result = simplifier.simplify(sample_text, target_level="beginner")
    
    assert result["target_level"] == "beginner"
    assert "simplified_content" in result
    assert len(result["key_takeaways"]) > 0


@pytest.mark.asyncio
async def test_mock_llm_service():
    service = get_llm_service("mock")
    response = await service.generate_response("Explain gravity in one sentence.")
    
    assert "text" in response
    assert "usage" in response
    assert response["finish_reason"] == "stop"
