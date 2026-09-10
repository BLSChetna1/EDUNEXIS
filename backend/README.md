# EDUNEXIS Backend Service 🚀

High-performance, modular asynchronous REST API powering the **EDUNEXIS** platform, built with **Python 3.11** and **FastAPI**.

---

## 📁 Architecture Overview

```text
backend/
├── app/
│   ├── api/
│   │   ├── routes/         # Modular endpoint handlers (chat, language, translate, speech)
│   │   └── __init__.py
│   ├── core/               # App configuration (Pydantic Settings) & security
│   ├── models/             # Database ORM data entities (architecture-ready)
│   ├── schemas/            # Pydantic request/response validation contracts
│   ├── services/           # Decoupled business logic & external API bridges
│   ├── database/           # Session management & connection lifecycle
│   └── main.py             # FastAPI entrypoint, middleware, root & health routes
├── requirements.txt        # Production & testing dependencies
└── README.md
```

---

## 🛠️ Local Development Setup

### 1. Create and Activate a Virtual Environment
```bash
# From EDUNEXIS/backend:
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\activate

# Linux / macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Ensure `.env` exists in the repository root (copied from `.env.example`). The backend automatically loads configuration using `pydantic-settings`.

### 4. Run the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative Docs (ReDoc): [http://localhost:8000/redoc](http://localhost:8000/redoc)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

## ➕ Adding New Routes & Features

To add a new endpoint (e.g., student progress tracking):
1. **Define Schema**: Add request/response schemas in `app/schemas/`.
2. **Implement Service**: Add business logic in `app/services/`.
3. **Create Route**: Create `app/api/routes/<feature>.py` with `APIRouter`.
4. **Register Router**: Include the new router in `app/api/routes/api.py`.
5. **Add Tests**: Create corresponding unit tests in `tests/backend/`.

---

## 🧪 Running Tests
```bash
# From the repository root or backend directory:
pytest tests/backend/
```

---

## 🌐 Member 3: Translation Module (`POST /api/translate`)

### Supported Languages
| Code | Language | Script |
|---|---|---|
| `en` | English | Latin |
| `te` | Telugu | Telugu |
| `hi` | Hindi | Devanagari |
| `ta` | Tamil | Tamil |
| `kn` | Kannada | Kannada |
| `ml` | Malayalam | Malayalam |
| `bn` | Bengali | Bengali |
| `mr` | Marathi | Devanagari |
| `gu` | Gujarati | Gujarati |

### Endpoints
- Primary: `POST /api/translate`
- Prefixed (for React frontend): `POST /api/v1/translate`

### Request Body
```json
{
  "text": "Hello, how are you?",
  "source_language": "en",
  "target_language": "te"
}
```

### Response Body (`200 OK`)
```json
{
  "translated_text": "హలో, మీరు ఎలా ఉన్నారు?",
  "source_language": "en",
  "target_language": "te"
}
```

### Validation Rules
- `text`: Non-empty, non-whitespace string (returns `422` if empty).
- `source_language`: Must be one of the supported codes or `"auto"`.
- `target_language`: Must be one of the 9 supported codes (returns `422` if unsupported or missing).

