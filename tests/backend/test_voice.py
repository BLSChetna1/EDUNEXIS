"""Voice API contract tests for STT and TTS adapters."""

import sys
from pathlib import Path

from fastapi.testclient import TestClient

backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app.main import app


client = TestClient(app)


def test_speech_to_text_accepts_contract_payload():
    response = client.post(
        "/api/v1/speech-to-text",
        json={
            "audio_base64": "UklGRg==",
            "audio_format": "webm",
            "language_code": "hi",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["transcript"]
    assert data["detected_language"] == "hi"


def test_speech_to_text_rejects_empty_audio():
    response = client.post(
        "/api/v1/speech-to-text",
        json={"audio_base64": "", "language_code": "auto"},
    )

    assert response.status_code == 422


def test_text_to_speech_accepts_voice_profile():
    response = client.post(
        "/api/v1/text-to-speech",
        json={
            "text": "Explain gravity simply.",
            "target_language": "en",
            "voice_gender": "male",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["audio_format"] == "mp3"
    assert "audio_base64" in data
