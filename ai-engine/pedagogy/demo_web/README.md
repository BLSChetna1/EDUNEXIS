# EDUNEXIS — AI Pedagogy Standalone Web Demo 🎓✨

This is a standalone test & demonstration web interface for the **Educational Content / AI Pedagogy** module of the EDUNEXIS project.

It provides interactive exploration of:
- **Verified Baseline Curriculum**: Class 1 & 2 lessons, worksheets, assessments, and flashcards.
- **Lesson Generator**: Dynamic resource bundling for Mathematics and Language.
- **AI Teaching Recommender**: Deterministic pedagogical strategy formulation, level scaffolding (Beginner, Intermediate, Advanced), sensory modality adaptation (Visual, Auditory, Activity Based, Mixed), and available time scaling.
- **Translation Adapter**: Translation-ready packaging for vernacular/tribal classrooms (e.g. Hindi, Santhali) while preserving baseline English integrity.

---

## 🚀 How to Run the Demo

### Preferred Command (from EDUNEXIS Project Root):

```bash
streamlit run ai-engine/pedagogy/demo_web/app.py
```

### Direct Python Fallback:

```bash
python ai-engine/pedagogy/demo_web/app.py
```

---

## 🌐 Local URL
When started with Streamlit, the demo opens at:
- **Local URL**: `http://localhost:8501`

---

## 🧭 Architecture Flow

```text
Educational Content (JSONs in lessons/, worksheets/, assessments/, flashcards/)
       ↓
Content Loader (content_loader.py)
       ↓
Lesson Generator (lesson_generator.py)
       ↓
Teaching Recommender (teaching_recommender.py)
       ↓
Translation Adapter (translation_adapter.py)
       ↓
run_pedagogy_demo() (demo.py)
       ↓
Standalone Demo Web UI (demo_web/app.py)
```

> **Note**: This interface is strictly isolated inside `ai-engine/pedagogy/demo_web/` for developer testing and prototype evaluation. It does not modify or replace the main frontend or backend modules.
