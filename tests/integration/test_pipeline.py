"""
Integration Tests for EDUNEXIS
Validates data flow between API schemas, routes, and services.
"""

import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_full_tutoring_integration_flow():
    """Simulate user asking a question, detecting language, and requesting translation."""
    # 1. Detect language
    detect_resp = client.post("/api/v1/language/detect", json={"text": "What is friction?"})
    assert detect_resp.status_code == 200
    detected = detect_resp.json()["language"]

    # 2. Query tutoring chat
    chat_resp = client.post(
        "/api/v1/chat",
        json={
            "message": "What is friction?",
            "target_language": detected,
            "pedagogy_level": "beginner",
        },
    )
    assert chat_resp.status_code == 200
    answer = chat_resp.json()["reply"]
    assert len(answer) > 0

    # 3. Request translation of answer
    trans_resp = client.post(
        "/api/v1/translate",
        json={
            "text": answer,
            "source_language": detected,
            "target_language": "hi",
        },
    )
    assert trans_resp.status_code == 200
    assert "translated_text" in trans_resp.json()
