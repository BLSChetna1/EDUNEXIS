"""
Tests for Member 3: EDUNEXIS Translation Module & API Integration
Verifies:
1. English -> Telugu
2. English -> Hindi
3. English -> Tamil
4. Telugu -> English
5. Empty / whitespace text
6. Invalid language code
7. Missing required fields
8. Both /api/translate and /api/v1/translate endpoint compatibility
9. Regional language matrix (kn, ml, bn, mr, gu)
"""

import sys
from pathlib import Path
import pytest

# Ensure backend root is on sys.path
backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_1_english_to_telugu():
    """Test 1: English -> Telugu translation."""
    payload = {
        "text": "Hello, how are you?",
        "source_language": "en",
        "target_language": "te",
    }
    response = client.post("/api/translate", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "translated_text" in data
    assert data["source_language"] == "en"
    assert data["target_language"] == "te"
    assert len(data["translated_text"].strip()) > 0
    # Verify Telugu characters or expected greeting
    assert any("\u0C00" <= c <= "\u0C7F" for c in data["translated_text"]) or "హలో" in data["translated_text"]


def test_2_english_to_hindi():
    """Test 2: English -> Hindi translation."""
    payload = {
        "text": "Hello, how are you?",
        "source_language": "en",
        "target_language": "hi",
    }
    response = client.post("/api/translate", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "translated_text" in data
    assert data["source_language"] == "en"
    assert data["target_language"] == "hi"
    assert len(data["translated_text"].strip()) > 0
    # Verify Devanagari script presence
    assert any("\u0900" <= c <= "\u097F" for c in data["translated_text"])


def test_3_english_to_tamil():
    """Test 3: English -> Tamil translation."""
    payload = {
        "text": "Hello, how are you?",
        "source_language": "en",
        "target_language": "ta",
    }
    response = client.post("/api/translate", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "translated_text" in data
    assert data["source_language"] == "en"
    assert data["target_language"] == "ta"
    assert len(data["translated_text"].strip()) > 0
    # Verify Tamil script presence
    assert any("\u0B80" <= c <= "\u0BFF" for c in data["translated_text"])


def test_4_telugu_to_english():
    """Test 4: Telugu -> English translation."""
    payload = {
        "text": "హలో, మీరు ఎలా ఉన్నారు?",
        "source_language": "te",
        "target_language": "en",
    }
    response = client.post("/api/translate", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "translated_text" in data
    assert data["source_language"] == "te"
    assert data["target_language"] == "en"
    # Result should be in English
    assert "hello" in data["translated_text"].lower() or "how are you" in data["translated_text"].lower()


def test_5_empty_text_validation():
    """Test 5: Empty string and whitespace-only text must be rejected."""
    # Case A: empty string
    res1 = client.post("/api/translate", json={"text": "", "source_language": "en", "target_language": "te"})
    assert res1.status_code == 422, f"Expected 422 for empty string, got {res1.status_code}"

    # Case B: whitespace-only string
    res2 = client.post("/api/translate", json={"text": "   \n\t  ", "source_language": "en", "target_language": "te"})
    assert res2.status_code == 422, f"Expected 422 for whitespace, got {res2.status_code}"


def test_6_invalid_language_code_validation():
    """Test 6: Unsupported language codes must be rejected."""
    # Invalid target language
    res1 = client.post("/api/translate", json={"text": "Hello", "source_language": "en", "target_language": "xyz_invalid"})
    assert res1.status_code == 422, f"Expected 422 for invalid target language, got {res1.status_code}"

    # Invalid source language
    res2 = client.post("/api/translate", json={"text": "Hello", "source_language": "klingon", "target_language": "te"})
    assert res2.status_code == 422, f"Expected 422 for invalid source language, got {res2.status_code}"


def test_7_missing_fields_validation():
    """Test 7: Missing required fields must be rejected."""
    # Missing 'text'
    res1 = client.post("/api/translate", json={"source_language": "en", "target_language": "te"})
    assert res1.status_code == 422, f"Expected 422 for missing text, got {res1.status_code}"

    # Missing 'target_language'
    res2 = client.post("/api/translate", json={"text": "Hello, how are you?"})
    assert res2.status_code == 422, f"Expected 422 for missing target_language, got {res2.status_code}"

    # Empty payload
    res3 = client.post("/api/translate", json={})
    assert res3.status_code == 422, f"Expected 422 for empty payload, got {res3.status_code}"


def test_8_endpoint_v1_and_api_compatibility():
    """Test 8: Verify both /api/translate and /api/v1/translate endpoints work."""
    payload = {
        "text": "Photosynthesis produces oxygen and glucose.",
        "source_language": "en",
        "target_language": "hi",
    }
    # Direct /api/translate
    res_direct = client.post("/api/translate", json=payload)
    assert res_direct.status_code == 200
    assert "translated_text" in res_direct.json()

    # Prefixed /api/v1/translate (used by React frontend)
    res_v1 = client.post("/api/v1/translate", json=payload)
    assert res_v1.status_code == 200
    assert "translated_text" in res_v1.json()


def test_9_regional_languages_support():
    """Test 9: Test translations across Kannada, Malayalam, Bengali, Marathi, Gujarati."""
    regional_targets = ["kn", "ml", "bn", "mr", "gu"]
    for lang in regional_targets:
        payload = {
            "text": "Hello, how are you?",
            "source_language": "en",
            "target_language": lang,
        }
        res = client.post("/api/translate", json=payload)
        assert res.status_code == 200, f"Failed for language {lang}: {res.text}"
        data = res.json()
        assert data["target_language"] == lang
        assert len(data["translated_text"].strip()) > 0
