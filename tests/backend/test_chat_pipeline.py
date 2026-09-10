"""Tests for transcript requests reaching the shared EDUNEXIS AI pipeline."""

import asyncio
import sys
from pathlib import Path
from unittest.mock import AsyncMock

from fastapi.testclient import TestClient

backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app.main import app
from app import services


client = TestClient(app)


def test_transcript_reaches_language_pedagogy_and_llm_pipeline(monkeypatch):
    fake_llm = AsyncMock()
    fake_llm.generate_response.return_value = {
        "text": "A stack is last-in, first-out. A queue is first-in, first-out.",
        "model": "test-model",
        "usage": {"total_tokens": 12},
    }
    monkeypatch.setattr(services, "llm_service", fake_llm)

    response = client.post(
        "/api/v1/chat",
        json={
            "message": "What is the difference between stack and queue?",
            "target_language": "en",
            "pedagogy_level": "beginner",
            "session_id": "voice-demo",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["reply"].startswith("A stack")
    assert data["detected_language"] == "en"
    assert data["metadata"]["voice_optimized"] is True
    assert data["metadata"]["session_id"] == "voice-demo"
    prompt = fake_llm.generate_response.call_args.kwargs["prompt"]
    system_instruction = fake_llm.generate_response.call_args.kwargs["system_instruction"]
    assert "stack and queue" in prompt
    assert "beginner" in system_instruction


def test_chat_rejects_empty_or_whitespace_transcript():
    response = client.post("/api/v1/chat", json={"message": "   "})

    assert response.status_code == 422


def test_chat_returns_safe_error_for_ai_failure(monkeypatch):
    fake_llm = AsyncMock()
    fake_llm.generate_response.side_effect = RuntimeError("provider secret should not leak")
    monkeypatch.setattr(services, "llm_service", fake_llm)

    response = client.post("/api/v1/chat", json={"message": "Explain gravity"})

    assert response.status_code == 502
    assert response.json()["detail"] == "AI response could not be generated"
    assert "secret" not in response.text


def test_chat_times_out_ai_request(monkeypatch):
    async def slow_response(**_kwargs):
        await asyncio.sleep(0.05)

    fake_llm = AsyncMock()
    fake_llm.generate_response.side_effect = slow_response
    monkeypatch.setattr(services, "llm_service", fake_llm)
    monkeypatch.setattr(services.settings, "LLM_TIMEOUT_SECONDS", 0.001)

    response = client.post("/api/v1/chat", json={"message": "Explain gravity"})

    assert response.status_code == 504


def test_chat_rejects_malformed_ai_response(monkeypatch):
    fake_llm = AsyncMock()
    fake_llm.generate_response.return_value = {"model": "test-model"}
    monkeypatch.setattr(services, "llm_service", fake_llm)

    response = client.post("/api/v1/chat", json={"message": "Explain gravity"})

    assert response.status_code == 502
    assert response.json()["detail"] == "AI returned an invalid response"