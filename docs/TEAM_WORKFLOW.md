# EDUNEXIS Team Workflow & Collaboration Guide 👥🛠️

> **Smart India Hackathon 2026**  
> Unified 5-Member Team Operational Model

---

## 1. Team Ownership Matrix

To enable all 5 team members to develop in parallel without blocking one another or generating merge conflicts, repository folders are divided by primary ownership:

```text
EDUNEXIS/
├── frontend/               ───► Member 1 (Frontend Lead)
│
├── backend/
│   ├── app/api/            ───► Member 2 (Backend Lead)
│   ├── app/schemas/        ───► Member 2 & Member 5
│   ├── app/services/       ───► Member 2 (with Member 3 & 4 integration)
│   ├── app/database/       ───► Member 5 (DevOps & Data Lead)
│   ├── app/models/         ───► Member 5 (DevOps & Data Lead)
│   └── app/core/           ───► Member 2 & Member 5
│
├── ai-engine/
│   ├── prompts/            ───► Member 3 (AI/NLP Specialist)
│   ├── pedagogy/           ───► Member 3 (AI/NLP Specialist)
│   ├── services/           ───► Member 3 (AI/NLP Specialist)
│   └── language/           ───► Member 4 (Speech & Multilingual Lead)
│
├── tests/
│   ├── frontend/           ───► Member 1 & Member 5
│   ├── backend/            ───► Member 2 & Member 5
│   ├── ai/                 ───► Member 3 & Member 5
│   └── integration/        ───► Member 5 (QA Lead)
│
└── docs/                   ───► Shared (Coordinated by Member 5)
```

---

## 2. Detailed Member Role Profiles

### 👤 Member 1: Frontend Lead
- **Primary Domain**: `frontend/`
- **Key Folders**:
  - `frontend/src/components/`: Reusable UI widgets (buttons, cards, language switches, audio waves).
  - `frontend/src/pages/`: Main application views (Home, TutorChat, ProgressDashboard).
  - `frontend/src/services/api.js`: Client-side HTTP calls conforming to `docs/API_CONTRACT.md`.
  - `frontend/src/hooks/`: State management hooks (audio recording, session state).
- **Core Objective**: Build responsive, intuitive, and accessible user interfaces that seamlessly consume backend endpoints.

---

### 👤 Member 2: Backend Lead
- **Primary Domain**: `backend/`
- **Key Folders**:
  - `backend/app/api/routes/`: Route controllers (`chat.py`, `language.py`, `translate.py`, `speech.py`).
  - `backend/app/schemas/`: Pydantic request and response contract definitions.
  - `backend/app/services/`: Business logic orchestration.
  - `backend/app/main.py`: FastAPI configuration, CORS middleware, and router mounts.
- **Core Objective**: Deliver reliable, asynchronous REST APIs that validate input, handle errors gracefully, and connect frontend requests to internal AI services.

---

### 👤 Member 3: AI & NLP Specialist
- **Primary Domain**: `ai-engine/`
- **Key Folders**:
  - `ai-engine/prompts/`: System prompt engineering and dynamic template generation.
  - `ai-engine/pedagogy/`: Educational scaffolding, simplification tiers, and concept extraction algorithms.
  - `ai-engine/services/llm_service.py`: LLM provider integration (Gemini, OpenAI, Claude, or local models).
- **Core Objective**: Optimize the quality, pedagogic soundness, and cognitive appropriateness of AI-generated educational content.

---

### 👤 Member 4: Speech & Multilingual Specialist
- **Primary Domain**: `ai-engine/language/` & External Voice/Translation Services
- **Key Folders**:
  - `ai-engine/language/`: Indic language identification, script parsing, and transliteration.
  - `backend/app/services/` (Translation & Speech adapters): Bhashini / Indic translation APIs, STT (Speech-to-Text), and TTS (Text-to-Speech) pipelines.
- **Core Objective**: Guarantee that non-English speaking learners have first-class voice and text experiences in their native tongues.

---

### 👤 Member 5: DevOps, QA & Database Architect
- **Primary Domain**: `tests/`, `backend/app/database/`, `backend/app/models/`, Repo Infrastructure
- **Key Folders**:
  - `tests/`: Automated unit, mock, and integration test suites.
  - `backend/app/database/`: Connection pools, session lifecycles, and future database migrations.
  - `backend/app/models/`: Database entities and ORM mappings.
  - `.env.example`, `.gitignore`: Repository hygiene, secret leak prevention, and CI/CD setup.
- **Core Objective**: Ensure zero-breakage deployments, robust test coverage, database readiness, and strict security compliance.

---

## 3. Git Branching Strategy

```text
main (Protected, stable production code)
  ▲
  │ (Pull Request via code review)
develop (Integration branch)
  ▲
  ├── feature/m1-frontend-chat-ui
  ├── feature/m2-backend-chat-router
  ├── feature/m3-pedagogy-scaffolding
  ├── feature/m4-bhashini-translation
  └── feature/m5-db-orm-models
```

### Branch Naming Convention
- `feature/m<1-5>-<short-description>`: For new capabilities.
- `fix/m<1-5>-<short-description>`: For bug fixes.
- `docs/<short-description>`: For documentation updates.

---

## 4. Pull Request & Integration Rules

1. **Never Commit Secrets**: Never push API keys, passwords, or `.env` files. Always update `.env.example` when introducing new environment variables.
2. **Adhere to the API Contract**: Any endpoint signature modification must be agreed upon and documented in `docs/API_CONTRACT.md` before code changes.
3. **Pass Automated Tests Before Merging**:
   ```bash
   # In frontend:
   cd frontend && npm run build
   
   # In backend:
   pytest tests/backend/ tests/ai/ tests/integration/
   ```
4. **Independent Modules**: Work within your designated folders to minimize cross-file merge conflicts.
