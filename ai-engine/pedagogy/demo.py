"""
Educational Content / AI Pedagogy Demonstration Interface
Demonstrates end-to-end pedagogical integration from content retrieval and lesson bundling
to teaching recommendations and translation preparation for downstream consumer layers (e.g. backend).
"""

from typing import Any, Dict, Optional
from .lesson_generator import generate_lesson
from .teaching_recommender import recommend_teaching
from .translation_adapter import TranslationAdapter


def run_pedagogy_demo(
    class_name: str,
    subject: str,
    topic: str,
    student_level: str = "beginner",
    learning_mode: str = "visual",
    available_time_minutes: Optional[int] = None,
    target_language: str = "English"
) -> Dict[str, Any]:
    """
    Execute the full end-to-end pedagogy processing pipeline.

    Args:
        class_name: Target grade level (e.g. 'Class 1').
        subject: Curriculum subject (e.g. 'Mathematics', 'Language').
        topic: Lesson topic (e.g. 'Numbers 1-10', 'Fruits', 'Basic Addition').
        student_level: Competency tier ('beginner', 'intermediate', 'advanced').
        learning_mode: Sensory modality ('visual', 'auditory', 'activity_based', 'mixed').
        available_time_minutes: Optional duration constraint in minutes.
        target_language: Target vernacular language (e.g. 'Hindi', 'Santali', 'English').

    Returns:
        Structured unified dictionary containing request parameters, lesson bundle,
        teaching recommendations, and translation package.
    """
    # 1. Generate core educational lesson bundle
    lesson_bundle = generate_lesson(
        class_name=class_name,
        subject=subject,
        topic=topic
    )

    # 2. Generate customized teaching recommendations
    recommendation = recommend_teaching(
        class_name=class_name,
        subject=subject,
        topic=topic,
        student_level=student_level,
        learning_mode=learning_mode,
        available_time_minutes=available_time_minutes
    )

    # 3. Prepare educational bundle for downstream translation
    adapter = TranslationAdapter()
    translation_package = adapter.prepare_for_translation(
        content=lesson_bundle,
        target_language=target_language
    )

    # 4. Return unified pedagogical package
    return {
        "request": {
            "class_name": class_name,
            "subject": subject,
            "topic": topic,
            "student_level": student_level,
            "learning_mode": learning_mode,
            "available_time_minutes": available_time_minutes,
            "target_language": target_language,
        },
        "lesson": lesson_bundle,
        "teaching_recommendation": recommendation,
        "translation_package": translation_package,
    }


def print_pedagogy_demo(result: Dict[str, Any]) -> None:
    """
    Print a clean, structured, human-readable terminal demonstration of the pedagogy output.
    """
    import sys
    # Ensure UTF-8 output if terminal supports reconfigure
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    req = result.get("request", {})
    lesson_bundle = result.get("lesson", {})
    lesson_meta = lesson_bundle.get("lesson", {})
    rec = result.get("teaching_recommendation", {})
    trans = result.get("translation_package", {})

    time_display = f"{req.get('available_time_minutes')} minutes" if req.get("available_time_minutes") else "Standard duration"

    print("========================================")
    print("        EDUNEXIS AI PEDAGOGY")
    print("========================================")
    print(f"\nClass: {req.get('class_name')}")
    print(f"Subject: {req.get('subject')}")
    print(f"Topic: {req.get('topic')}")
    print(f"\nStudent Level: {str(req.get('student_level')).capitalize()}")
    print(f"Learning Mode: {str(req.get('learning_mode')).capitalize()}")
    print(f"Available Time: {time_display}")
    print(f"Target Language: {req.get('target_language')}")

    print("\n----------------------------------------")
    print("LESSON")
    print("----------------------------------------")
    print("Learning Objectives:")
    for obj in lesson_meta.get("learning_objectives", []):
        print(f"- {obj}")

    print("\n----------------------------------------")
    print("TEACHING STRATEGY")
    print("----------------------------------------")
    print(rec.get("recommended_strategy", "N/A"))

    print("\nTeacher Tips:")
    for tip in rec.get("teacher_tips", []):
        print(f"- {tip}")

    print("\n----------------------------------------")
    print("LESSON STEPS")
    print("----------------------------------------")
    for step in rec.get("steps", []):
        s_num = step.get("step_number")
        s_title = step.get("title")
        s_dur = step.get("duration", "")
        s_desc = step.get("description", "")
        print(f"{s_num}. {s_title} ({s_dur}): {s_desc}")

    print("\n----------------------------------------")
    print("CLASSROOM ACTIVITIES")
    print("----------------------------------------")
    for act in rec.get("activities", []):
        act_name = act.get("activity_name", "Activity")
        act_desc = act.get("description", "")
        print(f"- {act_name}: {act_desc}")

    print("\n----------------------------------------")
    print("ASSESSMENT")
    print("----------------------------------------")
    for q in rec.get("assessment", []):
        q_text = q.get("question", "")
        q_ans = q.get("correct_answer") or q.get("expected_answer", "")
        print(f"- Q: {q_text} [Ans: {q_ans}]")

    print("\n----------------------------------------")
    print("FLASHCARDS")
    print("----------------------------------------")
    flashcards = lesson_bundle.get("flashcards", [])
    for fc in flashcards[:4]:
        f_front = fc.get("front", "")
        f_back = fc.get("back", "")
        print(f"- [{f_front}] -> {f_back}")
    if len(flashcards) > 4:
        print(f"  (... and {len(flashcards) - 4} more flashcards)")

    print("\n----------------------------------------")
    print("TRANSLATION STATUS")
    print("----------------------------------------")
    print(f"Source Language: {trans.get('source_language', 'English')}")
    print(f"Target Language: {trans.get('target_language', req.get('target_language'))}")
    trans_req = "Yes" if trans.get("translation_required") else "No"
    print(f"Translation Required: {trans_req}")
    print(f"Translatable Fields: {len(trans.get('translatable_fields', []))} fields cataloged")

    print("\n========================================")



def demo_numbers_lesson() -> Dict[str, Any]:
    """
    Run a standardized demo for Class 1 Mathematics: Numbers 1-10 with Hindi translation target.
    """
    return run_pedagogy_demo(
        class_name="Class 1",
        subject="Mathematics",
        topic="Numbers 1-10",
        student_level="beginner",
        learning_mode="visual",
        available_time_minutes=30,
        target_language="Hindi"
    )
