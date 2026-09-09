"""End-to-end backend contract for the voice tutoring path."""

import sys
from pathlib import Path
from unittest.mock import AsyncMock

from fastapi.testclient import TestClient

backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app import services
from app.main import app


client = TestClient(app)


def test_voice_transcript_to_ai_response_and_tts(monkeypatch):
    fake_llm = AsyncMock()
    fake_llm.generate_response.return_value = {
        "text": "A stack removes the newest item first. A queue removes the oldest item first.",
        "model": "test-model",
        "usage": {"total_tokens": 20},
    }
    monkeypatch.setattr(services, "llm_service", fake_llm)

    chat_response = client.post(
        "/api/v1/chat",
        json={
            "message": "What is the difference between stack and queue?",
            "target_language": "en",
            "pedagogy_level": "beginner",
            "session_id": "voice-session",
        },
    )
    assert chat_response.status_code == 200
    reply = chat_response.json()["reply"]

    tts_response = client.post(
        "/api/v1/text-to-speech",
        json={"text": reply, "target_language": "en", "voice_gender": "female"},
    )
    assert tts_response.status_code == 200
    assert "audio_base64" in tts_response.json()