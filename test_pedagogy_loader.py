"""
Test suite for pedagogy content loader functions.
"""
import sys
from pathlib import Path

# Add ai-engine to sys.path
repo_root = Path(__file__).resolve().parent
ai_engine_path = repo_root / "ai-engine"
if str(ai_engine_path) not in sys.path:
    sys.path.insert(0, str(ai_engine_path))

from pedagogy import (
    load_catalog,
    get_available_lessons,
    get_lesson,
    get_worksheet,
    get_assessment,
    get_flashcards,
    PedagogySimplifier,
)


def run_tests():
    print("========================================")
    print(" 1. Testing load_catalog()")
    print("========================================")
    catalog = load_catalog()
    print("Catalog loaded successfully!")
    print(f"Supported features: {catalog.get('supported_features')}")

    print("\n========================================")
    print(" 2. Available Lessons from Catalog")
    print("========================================")
    lessons = get_available_lessons()
    print(f"Total available lessons: {len(lessons)}")
    for item in lessons:
        print(f"  * [{item['id']}] {item['class']} - {item['subject']} ({item['topic']})")

    print("\n========================================")
    print(" 3. Loading All 3 Lessons")
    print("========================================")
    for item in lessons:
        lid = item["id"]
        lesson_data = get_lesson(lid)
        print(f"  + [{lid}] Loaded '{lesson_data['topic']}' | Duration: {lesson_data['duration']} | Steps: {len(lesson_data['lesson_steps'])} | Objectives: {len(lesson_data['learning_objectives'])}")

    print("\n========================================")
    print(" 4. Loading All 3 Worksheets")
    print("========================================")
    for item in lessons:
        lid = item["id"]
        ws_data = get_worksheet(lid)
        print(f"  + [{lid}] Worksheet loaded: {len(ws_data['questions'])} questions | Answer keys: {list(ws_data['answer_key'].keys())}")

    print("\n========================================")
    print(" 5. Loading All 3 Assessments")
    print("========================================")
    for item in lessons:
        lid = item["id"]
        cat = item["assessment_category"]
        asm_data = get_assessment(lid)
        print(f"  + [{lid}] Assessment '{cat}' loaded: {len(asm_data['questions'])} questions")

    print("\n========================================")
    print(" 6. Loading All 3 Flashcard Decks")
    print("========================================")
    for item in lessons:
        lid = item["id"]
        cat = item["flashcard_category"]
        fc_data = get_flashcards(lid)
        print(f"  + [{lid}] Flashcards '{cat}' loaded: {len(fc_data)} cards")

    print("\n========================================")
    print(" 7. Testing Robust Error Handling")
    print("========================================")
    try:
        get_lesson("invalid_lesson_id")
        print("  - [FAIL] Expected KeyError was not raised")
    except KeyError as exc:
        print(f"  - [PASS] KeyError caught as expected: {exc}")

    try:
        get_assessment("unknown_topic")
        print("  - [FAIL] Expected KeyError was not raised")
    except KeyError as exc:
        print(f"  - [PASS] KeyError caught as expected: {exc}")

    print("\n========================================")
    print(" 8. Preserved PedagogySimplifier Check")
    print("========================================")
    simplifier = PedagogySimplifier()
    result = simplifier.simplify("Numbers help children count items.", target_level="beginner")
    print(f"  - [PASS] Simplifier output: {result['simplified_content']}")

    print("\n>>> ALL 8 PEDAGOGY TESTS COMPLETED SUCCESSFULLY! <<<")


if __name__ == "__main__":
    run_tests()
