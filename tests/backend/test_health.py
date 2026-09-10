"""
Backend Health and Core Route Tests
Verifies that GET / and GET /health endpoints function correctly.
"""

import sys
from pathlib import Path

# Add backend directory to sys.path to allow root-level pytest execution
backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Test GET / returns 200 and expected metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs_url" in data
    assert data["docs_url"] == "/docs"


def test_health_endpoint():
    """Test GET /health returns 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "environment" in data


def test_chat_endpoint_contract():
    """Test POST /api/v1/chat endpoint responds with schema contract."""
    payload = {
        "message": "Explain photosynthesis simply",
        "target_language": "en",
        "pedagogy_level": "beginner",
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert data["pedagogy_level"] == "beginner"


def test_language_detect_endpoint():
    """Test POST /api/v1/language/detect endpoint."""
    payload = {"text": "नमस्ते, आप कैसे हैं?"}
    response = client.post("/api/v1/language/detect", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "language" in data
    assert "confidence" in data
