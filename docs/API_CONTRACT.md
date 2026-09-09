# EDUNEXIS API Contract Specification 📜

> **Version**: 1.0.0  
> **Base URL**: `http://localhost:8000` (Development) / `/api/v1`  
> **Format**: JSON (`Content-Type: application/json`)

This document defines the canonical contract between the **React Frontend** and the **FastAPI Backend**, as well as integrations with the **AI Engine** and external services.

---

## 1. System Endpoints

### `GET /`
Returns API metadata and documentation links.
- **Response `200 OK`**:
```json
{
  "message": "Welcome to EDUNEXIS API - Smart India Hackathon 2026",
  "docs_url": "/docs",
  "version": "1.0.0"
}
```

### `GET /health`
Liveness and readiness check.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## 2. Planned Functional Endpoints

### 2.1. Chat & Pedagogical Tutoring
`POST /api/v1/chat`

Processes student queries, adapts pedagogical complexity, and returns structured educational explanations.

- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "message": "Can you explain Newton's third law of motion?",
  "target_language": "en",
  "pedagogy_level": "beginner",
  "session_id": "sess_student_123"
}
```
| Field | Type | Required | Description |
|---|---|---|---|
| `message` | `string` | Yes | Student's input prompt or concept query |
| `target_language` | `string` | No (default: `"en"`) | ISO 639-1 code (e.g., `hi`, `ta`, `te`, `bn`, `en`) |
| `pedagogy_level` | `string` | No (default: `"standard"`) | Tier: `"beginner"`, `"intermediate"`, `"advanced"` |
| `session_id` | `string` | No | Unique session tracking identifier |

- **Response `200 OK`**:
```json
{
  "reply": "Newton's third law says that for every action, there is an equal and opposite reaction. Think of a skateboard...",
  "pedagogy_level": "beginner",
  "detected_language": "en",
  "metadata": {
    "model": "gemini-1.5-flash",
    "tokens_used": 142
  }
}
```

---

### 2.2. Language Identification
`POST /api/v1/language/detect`

Identifies the primary script and language of incoming text or student transcript.

- **Request Body**:
```json
{
  "text": "प्रकाश संश्लेषण की प्रक्रिया क्या है?"
}
```
| Field | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | Non-empty input string to detect |

- **Response `200 OK`**:
```json
{
  "language": "hi",
  "confidence": 0.98,
  "is_supported": true
}
```

---

### 2.3. Machine Translation
`POST /api/v1/translate`

Translates educational content across English and Indian regional languages (via Bhashini or Translation APIs).

- **Request Body**:
```json
{
  "text": "Photosynthesis produces oxygen and glucose.",
  "source_language": "en",
  "target_language": "hi"
}
```
| Field | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | Text content to translate |
| `source_language` | `string` | No (default: `"auto"`) | Source ISO language code or `"auto"` |
| `target_language` | `string` | Yes | Target ISO language code |

- **Response `200 OK`**:
```json
{
  "translated_text": "प्रकाश संश्लेषण ऑक्सीजन और ग्लूकोज का उत्पादन करता है।",
  "source_language": "en",
  "target_language": "hi"
}
```

---

### 2.4. Speech-to-Text (STT)
`POST /api/v1/speech-to-text`

Transcribes student voice queries into text in regional or English dialects.

- **Request Body**:
```json
{
  "audio_base64": "UklGRiQAAABXQVZFZm10IBAAAAABAAEA...",
  "audio_format": "wav",
  "language_code": "auto"
}
```
| Field | Type | Required | Description |
|---|---|---|---|
| `audio_base64` | `string` | Yes | Base64 encoded audio stream bytes |
| `audio_format` | `string` | No (default: `"wav"`) | Format audio container (`wav`, `mp3`, `webm`) |
| `language_code` | `string` | No (default: `"auto"`) | Expected spoken language code or `"auto"` |

- **Response `200 OK`**:
```json
{
  "transcript": "गुरुत्वाकर्षण क्या है?",
  "confidence": 0.94,
  "detected_language": "hi"
}
```

---

### 2.5. Text-to-Speech (TTS)
`POST /api/v1/text-to-speech`

Converts text lessons or AI explanations into natural-sounding speech audio for auditory learners.

- **Request Body**:
```json
{
  "text": "गुरुत्वाकर्षण वह बल है जो वस्तुओं को पृथ्वी के केंद्र की ओर खींचता है।",
  "target_language": "hi",
  "voice_gender": "female"
}
```
| Field | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | Text to synthesize |
| `target_language` | `string` | Yes | Target spoken language code |
| `voice_gender` | `string` | No (default: `"female"`) | Voice style (`"male"`, `"female"`) |

- **Response `200 OK`**:
```json
{
  "audio_base64": "UklGRiQAAABXQVZFZm10IBAAAAABAAEA...",
  "audio_format": "mp3",
  "duration_seconds": 3.8
}
```

---

## 3. Error Contract
Standardized error format returned for HTTP 4xx and 5xx statuses:
```json
{
  "detail": "Descriptive error message",
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2026-09-09T10:00:00Z"
}
```
