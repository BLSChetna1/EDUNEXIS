# EDUNEXIS AI Engine 🧠✨

The **AI Engine** is the intelligence subsystem of EDUNEXIS. It decouples prompt engineering, pedagogical heuristics, multilingual natural language processing, and LLM inference from API transport layers.

---

## 📁 Subsystem Structure

```text
ai-engine/
├── prompts/              # System prompt templates & pedagogical instructions
│   ├── templates.py
│   └── __init__.py
├── services/             # LLM inference abstraction layer & providers
│   ├── llm_service.py
│   └── __init__.py
├── language/             # Indic script detection & NLP heuristics
│   ├── detector.py
│   └── __init__.py
├── pedagogy/             # Cognitive complexity reduction & scaffolding
│   ├── simplifier.py
│   └── __init__.py
└── README.md
```

---

## 🧩 Core Modules

### 1. `prompts/` (Prompt Engineering)
- Contains standardized, version-controlled prompt templates for tutoring, concept decomposition, and language adaptation.
- Maintained primarily by **Member 3 (AI/NLP Specialist)**.

### 2. `services/` (LLM Service Layer)
- Abstract base class `BaseLLMService` ensures that changing LLM providers (Google Gemini, OpenAI, Claude, or local Ollama instances) requires **zero changes** to the backend API controllers.
- Currently uses `MockLLMService` for deterministic offline testing without requiring active API keys.

### 3. `language/` (Language & Script Processing)
- Contains `LanguageDetector` with unicode character-range detection for 8+ major Indic scripts (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam).
- Maintained by **Member 4 (Speech & Multilingual Specialist)**.

### 4. `pedagogy/` (Adaptive Scaffolding)
- Implements `PedagogySimplifier` to modulate reading level (Beginner, Intermediate, Advanced) and generate bite-sized conceptual takeaways.

---

## 🔌 Connecting Live AI & Translation Models

When ready to test live models:
1. Set `LLM_API_KEY`, `LLM_MODEL`, and `TRANSLATION_API_KEY` in `.env` (never commit this file).
2. Instantiate the live provider class inside `ai-engine/services/llm_service.py`.
3. Run tests in `tests/ai/` to verify accuracy and response schemas.
