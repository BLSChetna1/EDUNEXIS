"""
EDUNEXIS — AI Pedagogy Standalone Web Demonstration Interface
A self-contained browser-based demonstration UI for the Educational Content / AI Pedagogy subsystem.
Supports both Streamlit execution (`streamlit run app.py`) and zero-dependency Python execution (`python app.py`).
"""

import json
import os
import sys
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from typing import Any, Dict, Optional

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Ensure ai-engine is in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
AI_ENGINE_DIR = CURRENT_DIR.parent.parent
if str(AI_ENGINE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_DIR))


try:
    import streamlit as st
    STREAMLIT_AVAILABLE = True
except ImportError:
    STREAMLIT_AVAILABLE = False

from pedagogy import (
    run_pedagogy_demo,
    get_available_lessons,
    LessonGenerator,
)


# =====================================================================
# 1. STREAMLIT INTERFACE (Active when launched via `streamlit run`)
# =====================================================================
def render_streamlit_app():
    """Renders the Streamlit-based Pedagogy Demo Web UI."""
    st.set_page_config(
        page_title="EDUNEXIS — AI Pedagogy Demo",
        page_icon="🎓",
        layout="wide",
        initial_sidebar_state="expanded"
    )

    st.markdown("""
    <style>
    .main-title {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 800;
        color: #1E293B;
        margin-bottom: 0px;
    }
    .sub-title {
        color: #64748B;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }
    .section-header {
        font-weight: 700;
        color: #0F172A;
        border-bottom: 2px solid #E2E8F0;
        padding-bottom: 0.3rem;
        margin-top: 1.4rem;
        margin-bottom: 0.8rem;
    }
    .flashcard-box {
        background: #F8FAFC;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.8rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .tip-box {
        background: #EFF6FF;
        border-left: 4px solid #3B82F6;
        padding: 0.8rem 1rem;
        border-radius: 4px;
        margin-bottom: 0.8rem;
    }
    .strategy-callout {
        background: #F0FDF4;
        border-left: 4px solid #22C55E;
        padding: 0.8rem 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-weight: 500;
    }
    </style>
    """, unsafe_allow_html=True)

    st.markdown("<h1 class='main-title'>EDUNEXIS — AI Pedagogy Demo</h1>", unsafe_allow_html=True)
    st.markdown("<p class='sub-title'>Educational Content & AI Teaching Recommendation (Hackathon Prototype)</p>", unsafe_allow_html=True)

    all_catalog_lessons = get_available_lessons()
    classes = sorted(list({l.get("class") for l in all_catalog_lessons if "class" in l}))
    default_class_idx = classes.index("Class 1") if "Class 1" in classes else 0

    with st.sidebar:
        st.header("⚙️ Lesson Parameters")
        selected_class = st.selectbox("1. Class", classes, index=default_class_idx)

        available_subjects = sorted(list({
            l.get("subject") for l in all_catalog_lessons
            if l.get("class") == selected_class and "subject" in l
        }))
        default_sub_idx = available_subjects.index("Mathematics") if "Mathematics" in available_subjects else 0
        selected_subject = st.selectbox("2. Subject", available_subjects, index=default_sub_idx)

        available_topics = [
            l.get("topic") for l in all_catalog_lessons
            if l.get("class") == selected_class and l.get("subject") == selected_subject and "topic" in l
        ]
        default_top_idx = available_topics.index("Numbers 1-10") if "Numbers 1-10" in available_topics else 0
        selected_topic = st.selectbox("3. Topic", available_topics, index=default_top_idx)

        selected_level = st.selectbox("4. Student Level", ["Beginner", "Intermediate", "Advanced"], index=0)
        selected_mode = st.selectbox("5. Learning Mode", ["Visual", "Auditory", "Activity Based", "Mixed"], index=0)
        selected_time_label = st.selectbox(
            "6. Available Time",
            ["30 minutes", "20 minutes", "40 minutes", "60 minutes", "Original lesson duration"],
            index=0
        )
        time_mapping = {
            "20 minutes": 20, "30 minutes": 30, "40 minutes": 40,
            "60 minutes": 60, "Original lesson duration": None
        }
        selected_time_val = time_mapping.get(selected_time_label, 30)

        selected_language = st.selectbox("7. Target Language", ["Hindi", "English", "Santhali"], index=0)
        st.markdown("---")
        st.button("🚀 Generate Teaching Plan", type="primary", use_container_width=True)

    mode_key_map = {
        "Visual": "visual", "Auditory": "auditory",
        "Activity Based": "activity_based", "Mixed": "mixed"
    }

    try:
        result = run_pedagogy_demo(
            class_name=selected_class,
            subject=selected_subject,
            topic=selected_topic,
            student_level=selected_level.lower(),
            learning_mode=mode_key_map.get(selected_mode, "visual"),
            available_time_minutes=selected_time_val,
            target_language=selected_language
        )

        lesson_data = result["lesson"]["lesson"]
        rec_data = result["teaching_recommendation"]
        trans_data = result["translation_package"]
        flashcards_list = result["lesson"]["flashcards"]

        st.markdown("<h3 class='section-header'>📚 Section 1: Lesson Overview</h3>", unsafe_allow_html=True)
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Class", lesson_data.get("class"))
        col2.metric("Subject", lesson_data.get("subject"))
        col3.metric("Topic", lesson_data.get("topic"))
        col4.metric("Allocated Time", f"{rec_data['student_context']['available_time_minutes']} mins")

        st.markdown(f"**Introduction:** {lesson_data.get('introduction')}")
        st.markdown("**Learning Objectives:**")
        for obj in lesson_data.get("learning_objectives", []):
            st.markdown(f"- {obj}")

        st.markdown("<h3 class='section-header'>🧑‍🏫 Section 2: Recommended Teaching Strategy</h3>", unsafe_allow_html=True)
        st.markdown(f"<div class='strategy-callout'>🎯 <b>Pedagogical Strategy:</b><br>{rec_data.get('recommended_strategy')}</div>", unsafe_allow_html=True)
        st.markdown("**Teacher Tips for Vernacular/Tribal Classroom:**")
        for tip in rec_data.get("teacher_tips", []):
            st.markdown(f"<div class='tip-box'>💡 {tip}</div>", unsafe_allow_html=True)

        st.markdown("<h3 class='section-header'>⏱️ Section 3: Adapted Lesson Steps</h3>", unsafe_allow_html=True)
        for step in rec_data.get("steps", []):
            with st.expander(f"Step {step.get('step_number')}: {step.get('title')} ({step.get('duration')})", expanded=True):
                st.write(step.get("description"))

        st.markdown("<h3 class='section-header'>🎯 Section 4: Classroom Activities</h3>", unsafe_allow_html=True)
        for act in rec_data.get("activities", []):
            st.info(f"**{act.get('activity_name')}**: {act.get('description')}")

        st.markdown("<h3 class='section-header'>📝 Section 5: Assessment & Formative Checks</h3>", unsafe_allow_html=True)
        for i, q in enumerate(rec_data.get("assessment", []), 1):
            with st.container():
                st.markdown(f"**Q{i}. {q.get('question')}**")
                if "options" in q:
                    st.write(f"Options: {', '.join(q['options'])}")
                ans = q.get('correct_answer') or q.get('expected_answer')
                st.success(f"**Correct Answer:** {ans}")
                if "explanation" in q:
                    st.caption(f"Explanation: {q['explanation']}")
                st.markdown("---")

        st.markdown("<h3 class='section-header'>🎴 Section 6: Flashcards Deck</h3>", unsafe_allow_html=True)
        fc_cols = st.columns(min(4, max(1, len(flashcards_list))))
        for idx, fc in enumerate(flashcards_list):
            col_target = fc_cols[idx % len(fc_cols)]
            with col_target:
                hint_str = f"<br><small style='color:#64748B;'>{fc.get('hint') or fc.get('sentence') or ''}</small>"
                st.markdown(f"""
                <div class='flashcard-box'>
                    <h4 style='margin:0; color:#2563EB;'>{fc.get('front')}</h4>
                    <p style='margin:0.5rem 0 0 0; font-weight:600;'>{fc.get('back')}</p>
                    {hint_str}
                </div>
                """, unsafe_allow_html=True)

        st.markdown("<h3 class='section-header'>🌐 Section 7: Translation Status</h3>", unsafe_allow_html=True)
        t_col1, t_col2, t_col3 = st.columns(3)
        t_col1.metric("Source Language", trans_data.get("source_language", "English"))
        t_col2.metric("Target Language", trans_data.get("target_language", selected_language))
        req_text = "Yes" if trans_data.get("translation_required") else "No"
        t_col3.metric("Translation Required", req_text)

        if trans_data.get("translation_required"):
            st.info(
                f"ℹ️ **Translation Ready**: The pedagogy module has packaged structured translatable "
                f"content for target language **{selected_language}**. English baseline data is fully preserved without mutating original content."
            )
        else:
            st.success("✅ Baseline curriculum content is in English. No translation needed.")

    except Exception as exc:
        st.error(f"⚠️ Error generating teaching plan: {str(exc)}")


# =====================================================================
# 2. STANDALONE PYTHON WEB SERVER (Active when launched via `python app.py`)
# =====================================================================
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDUNEXIS — AI Pedagogy Demo</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563EB;
            --primary-dark: #1D4ED8;
            --bg: #F8FAFC;
            --card-bg: #FFFFFF;
            --text-main: #0F172A;
            --text-muted: #64748B;
            --border: #E2E8F0;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--bg);
            color: var(--text-main);
            display: flex;
            min-height: 100vh;
        }
        .sidebar {
            width: 340px;
            background: #FFFFFF;
            border-right: 1px solid var(--border);
            padding: 1.5rem;
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
        }
        .sidebar h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.2rem; color: #1E293B; }
        .form-group { margin-bottom: 1.1rem; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; color: #334155; }
        .form-group select {
            width: 100%;
            padding: 0.6rem 0.8rem;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-family: inherit;
            font-size: 0.9rem;
            background: #FFFFFF;
            color: #0F172A;
            outline: none;
        }
        .form-group select:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(37,99,235,0.15); }
        .btn-submit {
            width: 100%;
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            font-size: 0.95rem;
            transition: background 0.2s;
            margin-top: 0.5rem;
        }
        .btn-submit:hover { background: var(--primary-dark); }
        .main-content {
            flex: 1;
            padding: 2rem 3rem;
            overflow-y: auto;
        }
        .header h1 { font-size: 1.8rem; font-weight: 800; color: #0F172A; }
        .header p { color: var(--text-muted); margin-top: 0.2rem; margin-bottom: 1.8rem; }
        .section-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .section-card h3 {
            font-size: 1.15rem;
            font-weight: 700;
            color: #0F172A;
            border-bottom: 1px solid var(--border);
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 1.2rem;
        }
        .metric-box {
            background: #F1F5F9;
            padding: 0.9rem 1rem;
            border-radius: 8px;
        }
        .metric-box small { color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .metric-box p { font-size: 1.1rem; font-weight: 700; color: #0F172A; margin-top: 0.2rem; }
        .strategy-banner {
            background: #F0FDF4;
            border-left: 4px solid #22C55E;
            padding: 1rem;
            border-radius: 6px;
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 1rem;
        }
        .tip-item {
            background: #EFF6FF;
            border-left: 3px solid var(--primary);
            padding: 0.6rem 0.9rem;
            border-radius: 4px;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        .step-item {
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 0.9rem 1.1rem;
            margin-bottom: 0.8rem;
            background: #FAFAFA;
        }
        .step-header { font-weight: 700; color: #1E293B; margin-bottom: 0.3rem; }
        .flashcard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
        .flashcard {
            background: #F8FAFC;
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
        }
        .flashcard h4 { color: var(--primary); font-size: 1.05rem; }
        .flashcard p { font-weight: 700; margin: 0.4rem 0; color: #0F172A; }
        .flashcard small { color: var(--text-muted); font-size: 0.8rem; }
        .badge-yes { background: #DCFCE7; color: #166534; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.85rem; }
        .badge-no { background: #F1F5F9; color: #475569; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.85rem; }
        .alert-box { background: #FEF2F2; border: 1px solid #FCA5A5; color: #991B1B; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>⚙️ Lesson Parameters</h2>
        <div class="form-group">
            <label>1. Class</label>
            <select id="classSelect" onchange="onClassChange()"></select>
        </div>
        <div class="form-group">
            <label>2. Subject</label>
            <select id="subjectSelect" onchange="onSubjectChange()"></select>
        </div>
        <div class="form-group">
            <label>3. Topic</label>
            <select id="topicSelect"></select>
        </div>
        <div class="form-group">
            <label>4. Student Level</label>
            <select id="levelSelect">
                <option value="beginner" selected>Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
            </select>
        </div>
        <div class="form-group">
            <label>5. Learning Mode</label>
            <select id="modeSelect">
                <option value="visual" selected>Visual</option>
                <option value="auditory">Auditory</option>
                <option value="activity_based">Activity Based</option>
                <option value="mixed">Mixed</option>
            </select>
        </div>
        <div class="form-group">
            <label>6. Available Time</label>
            <select id="timeSelect">
                <option value="30" selected>30 minutes</option>
                <option value="20">20 minutes</option>
                <option value="40">40 minutes</option>
                <option value="60">60 minutes</option>
                <option value="none">Original lesson duration</option>
            </select>
        </div>
        <div class="form-group">
            <label>7. Target Language</label>
            <select id="langSelect">
                <option value="Hindi" selected>Hindi</option>
                <option value="English">English</option>
                <option value="Santhali">Santhali</option>
            </select>
        </div>
        <button class="btn-submit" onclick="generateTeachingPlan()">🚀 Generate Teaching Plan</button>
    </div>

    <div class="main-content">
        <div class="header">
            <h1>EDUNEXIS — AI Pedagogy Demo</h1>
            <p>Educational Content & AI Teaching Recommendation (Hackathon Prototype)</p>
        </div>
        <div id="resultsContainer"></div>
    </div>

    <script>
        const catalog = CATALOG_DATA_PLACEHOLDER;

        function initDropdowns() {
            const classSelect = document.getElementById('classSelect');
            const classes = [...new Set(catalog.map(l => l.class))].sort();
            classSelect.innerHTML = classes.map(c => `<option value="${c}" ${c === 'Class 1' ? 'selected' : ''}>${c}</option>`).join('');
            onClassChange();
        }

        function onClassChange() {
            const selectedClass = document.getElementById('classSelect').value;
            const subjectSelect = document.getElementById('subjectSelect');
            const subjects = [...new Set(catalog.filter(l => l.class === selectedClass).map(l => l.subject))].sort();
            subjectSelect.innerHTML = subjects.map(s => `<option value="${s}" ${s === 'Mathematics' ? 'selected' : ''}>${s}</option>`).join('');
            onSubjectChange();
        }

        function onSubjectChange() {
            const selectedClass = document.getElementById('classSelect').value;
            const selectedSubject = document.getElementById('subjectSelect').value;
            const topicSelect = document.getElementById('topicSelect');
            const topics = catalog.filter(l => l.class === selectedClass && l.subject === selectedSubject).map(l => l.topic);
            topicSelect.innerHTML = topics.map(t => `<option value="${t}" ${t === 'Numbers 1-10' ? 'selected' : ''}>${t}</option>`).join('');
        }

        async function generateTeachingPlan() {
            const container = document.getElementById('resultsContainer');
            container.innerHTML = '<p style="color:var(--text-muted); font-size:1.05rem;">⏳ Generating pedagogical teaching package...</p>';

            const payload = {
                class_name: document.getElementById('classSelect').value,
                subject: document.getElementById('subjectSelect').value,
                topic: document.getElementById('topicSelect').value,
                student_level: document.getElementById('levelSelect').value,
                learning_mode: document.getElementById('modeSelect').value,
                available_time_minutes: document.getElementById('timeSelect').value === 'none' ? null : parseInt(document.getElementById('timeSelect').value),
                target_language: document.getElementById('langSelect').value
            };

            try {
                const res = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.error) {
                    container.innerHTML = `<div class="alert-box">⚠️ ${data.error}</div>`;
                    return;
                }
                renderResults(data);
            } catch (err) {
                container.innerHTML = `<div class="alert-box">⚠️ Failed to connect to pedagogy engine: ${err.message}</div>`;
            }
        }

        function renderResults(data) {
            const lesson = data.lesson.lesson;
            const rec = data.teaching_recommendation;
            const trans = data.translation_package;
            const flashcards = data.lesson.flashcards || [];

            let html = `
                <!-- SECTION 1 -->
                <div class="section-card">
                    <h3>📚 Section 1: Lesson Overview</h3>
                    <div class="metrics-grid">
                        <div class="metric-box"><small>Class</small><p>${lesson.class}</p></div>
                        <div class="metric-box"><small>Subject</small><p>${lesson.subject}</p></div>
                        <div class="metric-box"><small>Topic</small><p>${lesson.topic}</p></div>
                        <div class="metric-box"><small>Allocated Time</small><p>${rec.student_context.available_time_minutes} mins</p></div>
                    </div>
                    <p style="margin-bottom:0.8rem;"><strong>Introduction:</strong> ${lesson.introduction}</p>
                    <strong>Learning Objectives:</strong>
                    <ul style="margin-left: 1.2rem; margin-top: 0.3rem;">
                        ${lesson.learning_objectives.map(o => `<li>${o}</li>`).join('')}
                    </ul>
                </div>

                <!-- SECTION 2 -->
                <div class="section-card">
                    <h3>🧑‍🏫 Section 2: Recommended Teaching Strategy</h3>
                    <div class="strategy-banner">🎯 <strong>Pedagogical Strategy:</strong><br>${rec.recommended_strategy}</div>
                    <strong>Teacher Tips for Vernacular/Tribal Classroom:</strong>
                    <div style="margin-top: 0.5rem;">
                        ${rec.teacher_tips.map(t => `<div class="tip-item">💡 ${t}</div>`).join('')}
                    </div>
                </div>

                <!-- SECTION 3 -->
                <div class="section-card">
                    <h3>⏱️ Section 3: Adapted Lesson Steps</h3>
                    ${rec.steps.map(s => `
                        <div class="step-item">
                            <div class="step-header">Step ${s.step_number}: ${s.title} (${s.duration})</div>
                            <div>${s.description}</div>
                        </div>
                    `).join('')}
                </div>

                <!-- SECTION 4 -->
                <div class="section-card">
                    <h3>🎯 Section 4: Classroom Activities</h3>
                    ${rec.activities.map(a => `
                        <div class="tip-item" style="border-left-color: #10B981; background: #ECFDF5; margin-bottom: 0.8rem;">
                            <strong>${a.activity_name}:</strong> ${a.description}
                        </div>
                    `).join('')}
                </div>

                <!-- SECTION 5 -->
                <div class="section-card">
                    <h3>📝 Section 5: Assessment & Formative Checks</h3>
                    ${rec.assessment.map((q, idx) => `
                        <div style="margin-bottom: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid var(--border);">
                            <p><strong>Q${idx+1}. ${q.question}</strong></p>
                            ${q.options ? `<p style="color:var(--text-muted); font-size:0.9rem; margin: 0.3rem 0;">Options: ${q.options.join(', ')}</p>` : ''}
                            <p style="color:#16A34A; font-weight:700; margin-top: 0.2rem;">Correct Answer: ${q.correct_answer || q.expected_answer}</p>
                            ${q.explanation ? `<p style="font-size:0.85rem; color:var(--text-muted);">Explanation: ${q.explanation}</p>` : ''}
                        </div>
                    `).join('')}
                </div>

                <!-- SECTION 6 -->
                <div class="section-card">
                    <h3>🎴 Section 6: Flashcards Deck</h3>
                    <div class="flashcard-grid">
                        ${flashcards.map(fc => `
                            <div class="flashcard">
                                <h4>${fc.front}</h4>
                                <p>${fc.back}</p>
                                ${fc.hint || fc.sentence ? `<small>${fc.hint || fc.sentence}</small>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- SECTION 7 -->
                <div class="section-card">
                    <h3>🌐 Section 7: Translation Status</h3>
                    <div class="metrics-grid" style="grid-template-columns: repeat(3, 1fr);">
                        <div class="metric-box"><small>Source Language</small><p>${trans.source_language}</p></div>
                        <div class="metric-box"><small>Target Language</small><p>${trans.target_language}</p></div>
                        <div class="metric-box"><small>Translation Required</small><p><span class="${trans.translation_required ? 'badge-yes' : 'badge-no'}">${trans.translation_required ? 'Yes' : 'No'}</span></p></div>
                    </div>
                    <p style="font-size:0.9rem; color:var(--text-muted);">
                        ${trans.translation_required 
                            ? `ℹ️ Translation package prepared for downstream Indic/tribal language translation module. English baseline data is preserved without mutating original content.` 
                            : `✅ Baseline curriculum content is in English. No translation required.`}
                    </p>
                </div>
            `;
            document.getElementById('resultsContainer').innerHTML = html;
        }

        window.onload = () => {
            initDropdowns();
            generateTeachingPlan();
        };
    </script>
</body>
</html>
"""

from http.server import HTTPServer, ThreadingHTTPServer, BaseHTTPRequestHandler
import json


class PedagogyHTTPHandler(BaseHTTPRequestHandler):
    """Custom HTTP handler for zero-dependency local web demo UI."""

    def log_message(self, format, *args):
        # Suppress noisy HTTP request logs in console
        pass

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Connection", "close")
        self.end_headers()

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            catalog_json = json.dumps(get_available_lessons())
            html = HTML_TEMPLATE.replace("CATALOG_DATA_PLACEHOLDER", catalog_json).encode("utf-8")
            self.send_header("Content-Length", str(len(html)))
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(html)
        else:
            self.send_error(404, "Not Found")

    def do_POST(self):
        if self.path == "/api/generate":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            try:
                params = json.loads(body.decode("utf-8"))
                result = run_pedagogy_demo(
                    class_name=params.get("class_name", "Class 1"),
                    subject=params.get("subject", "Mathematics"),
                    topic=params.get("topic", "Numbers 1-10"),
                    student_level=params.get("student_level", "beginner"),
                    learning_mode=params.get("learning_mode", "visual"),
                    available_time_minutes=params.get("available_time_minutes", 30),
                    target_language=params.get("target_language", "Hindi")
                )
                response_data = json.dumps(result).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Length", str(len(response_data)))
                self.send_header("Connection", "close")
                self.end_headers()
                self.wfile.write(response_data)
            except Exception as exc:
                err_data = json.dumps({"error": str(exc)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Length", str(len(err_data)))
                self.send_header("Connection", "close")
                self.end_headers()
                self.wfile.write(err_data)
        else:
            self.send_error(404, "Endpoint Not Found")


def run_standalone_server(port: int = 8501):
    """Starts the zero-dependency built-in multi-threaded web server."""
    server_address = ("0.0.0.0", port)
    try:
        httpd = ThreadingHTTPServer(server_address, PedagogyHTTPHandler)
    except OSError:
        port = 8502
        server_address = ("0.0.0.0", port)
        httpd = ThreadingHTTPServer(server_address, PedagogyHTTPHandler)

    print(f"\n========================================================")
    print(f"  EDUNEXIS AI Pedagogy Standalone Web Demo Running")
    print(f"  Local URL: http://localhost:{port}")
    print(f"  Alt URL:   http://127.0.0.1:{port}")
    print(f"  Press Ctrl+C to stop the server.")
    print(f"========================================================\n", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping pedagogy demo server...")
        httpd.server_close()


if __name__ == "__main__":
    if STREAMLIT_AVAILABLE and "streamlit" in sys.modules:
        render_streamlit_app()
    else:
        run_standalone_server()
