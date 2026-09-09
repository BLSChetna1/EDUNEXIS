# EDUNEXIS 🎓🌐
> **Smart India Hackathon 2026**
> Next-Generation Multilingual, AI-Driven Adaptive Learning Platform

---

## 🌟 Overview
**EDUNEXIS** is an intelligent educational ecosystem designed to bridge linguistic and pedagogical divides in education. Leveraging advanced Natural Language Processing (NLP), Large Language Models (LLMs), machine translation, and speech-to-text / text-to-speech services, EDUNEXIS delivers accessible, localized, and personalized learning materials for students across diverse linguistic backgrounds.

This repository serves as the **unified, production-grade monorepo** for our 5-member team.

---

## 🏗️ Repository Architecture

```text
EDUNEXIS/
│
├── frontend/             # React + Vite Client Application
│   ├── public/           # Static assets and favicon
│   └── src/
│       ├── components/   # Reusable UI widgets & design system
│       ├── pages/        # View routes (Home, Dashboard, etc.)
│       ├── services/     # Axios/fetch API clients
│       ├── hooks/        # Custom React hooks
│       ├── utils/        # Helper functions & formatters
│       └── assets/       # Media, icons, and illustrations
│
├── backend/              # Python FastAPI Application
│   ├── app/
│   │   ├── api/          # API route definitions & endpoints
│   │   │   └── routes/
│   │   ├── core/         # Config, security, and app lifecycle
│   │   ├── models/       # Database ORM models (architecture-ready)
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # Core business logic services
│   │   ├── database/     # DB connection session management
│   │   └── main.py       # FastAPI application entrypoint
│   ├── requirements.txt  # Python dependency manifest
│   └── README.md         # Backend setup and contribution guide
│
├── ai-engine/            # AI, NLP & Pedagogical Simplification Modules
│   ├── prompts/          # System prompts & instruction templates
│   ├── services/         # LLM service wrappers & providers
│   ├── language/         # Language identification & transliteration
│   ├── pedagogy/         # Simplification, readability & summarization
│   └── README.md         # AI engine guide and model hooks
│
├── tests/                # Automated Test Suites
│   ├── frontend/         # Component & end-to-end tests
│   ├── backend/          # FastAPI unit & integration tests
│   ├── ai/               # AI Engine & mock inference tests
│   └── integration/      # Full-stack API & workflow integration
│
├── docs/                 # Team and Technical Documentation
│   ├── API_CONTRACT.md   # Canonical REST API specifications
│   ├── ARCHITECTURE.md   # Architectural blueprint & data flow
│   └── TEAM_WORKFLOW.md  # 5-member roles, branching & review rules
│
├── .env.example          # Environment variable template
├── .gitignore            # Git exclusion rules
└── README.md             # Repository landing document
```

---

## 👥 5-Member Team Allocation

To maintain parallel velocity and zero merge friction, responsibilities are cleanly divided:

| Member | Primary Domain | Focus Folders | Key Responsibilities |
|---|---|---|---|
| **Member 1** | Frontend Lead | `frontend/` | React components, UI/UX, responsive views, API client hooks |
| **Member 2** | Backend Lead | `backend/app/api/`, `backend/app/services/` | FastAPI routes, business logic, middleware, orchestration |
| **Member 3** | AI / NLP Specialist | `ai-engine/`, `ai-engine/prompts/`, `ai-engine/pedagogy/` | LLM pipelines, prompt engineering, adaptive simplification |
| **Member 4** | Multilingual & Speech | `ai-engine/language/`, Translation & Speech APIs | STT/TTS integrations, language detection, Indic translations |
| **Member 5** | QA, DevOps & Data | `tests/`, `backend/app/database/`, `backend/app/models/` | DB schema design, unit/integration testing, CI/CD, deployment |

*For complete details on branching and PR guidelines, see [docs/TEAM_WORKFLOW.md](docs/TEAM_WORKFLOW.md).*

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0+ (v20+ recommended)
- **Python**: v3.10+ (v3.11 recommended)
- **Git**

### 2. Environment Setup
Copy the environment template and configure local variables:
```bash
cp .env.example .env
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Development Server: [http://localhost:5173](http://localhost:5173)

---

## 📖 Key Documentation
- [API Contract Specification](docs/API_CONTRACT.md)
- [System Architecture Blueprint](docs/ARCHITECTURE.md)
- [Team Workflow & Git Strategy](docs/TEAM_WORKFLOW.md)
