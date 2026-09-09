"""
Pedagogy Educational Content Loader Module
Loads structured lessons, worksheets, assessments, and flashcards from catalog.
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

# Module-relative path so loading works regardless of CWD
PEDAGOGY_DIR: Path = Path(__file__).resolve().parent
CATALOG_PATH: Path = PEDAGOGY_DIR / "content_catalog.json"
ASSESSMENTS_PATH: Path = PEDAGOGY_DIR / "assessments" / "questions.json"
FLASHCARDS_PATH: Path = PEDAGOGY_DIR / "flashcards" / "flashcards.json"


def _load_json_file(file_path: Path) -> Dict[str, Any]:
    """
    Safely load and parse a JSON file with clear error reporting.

    Raises:
        FileNotFoundError: If the target file does not exist.
        ValueError: If the file contains invalid JSON.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Educational content file not found: {file_path}")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON format in '{file_path.name}': {exc.msg} (line {exc.lineno}, col {exc.colno})") from exc


def load_catalog() -> Dict[str, Any]:
    """
    Load the master content catalog JSON.

    Returns:
        Dict containing supported features and lesson metadata list.
    """
    return _load_json_file(CATALOG_PATH)


def get_available_lessons() -> List[Dict[str, Any]]:
    """
    Retrieve metadata for all available lessons from the catalog.

    Returns:
        List of lesson catalog entries.
    """
    catalog = load_catalog()
    return catalog.get("lessons", [])


def _get_catalog_entry(lesson_id: str) -> Dict[str, Any]:
    """
    Helper to look up a lesson entry in the catalog by lesson ID.

    Raises:
        KeyError: If lesson_id does not exist in the catalog.
    """
    if not lesson_id or not isinstance(lesson_id, str):
        raise ValueError("A valid non-empty string lesson_id must be provided.")

    lessons = get_available_lessons()
    for entry in lessons:
        if entry.get("id") == lesson_id:
            return entry

    available_ids = [e.get("id") for e in lessons if "id" in e]
    raise KeyError(f"Lesson ID '{lesson_id}' not found in catalog. Available IDs: {available_ids}")


def get_lesson(lesson_id: str) -> Dict[str, Any]:
    """
    Load and return the full lesson plan JSON for a given lesson ID.

    Args:
        lesson_id: Unique identifier for the lesson (e.g., 'class1_numbers').

    Returns:
        Dict containing complete lesson plan data.
    """
    entry = _get_catalog_entry(lesson_id)
    lesson_file = entry.get("lesson_file")
    if not lesson_file:
        raise ValueError(f"No 'lesson_file' path configured for lesson '{lesson_id}'.")

    target_path = PEDAGOGY_DIR / lesson_file
    return _load_json_file(target_path)


def get_worksheet(lesson_id: str) -> Dict[str, Any]:
    """
    Load and return the corresponding worksheet JSON for a given lesson ID.

    Args:
        lesson_id: Unique identifier for the lesson (e.g., 'class1_fruits').

    Returns:
        Dict containing worksheet instructions, questions, and answer key.
    """
    entry = _get_catalog_entry(lesson_id)
    worksheet_file = entry.get("worksheet_file")
    if not worksheet_file:
        raise ValueError(f"No 'worksheet_file' path configured for lesson '{lesson_id}'.")

    target_path = PEDAGOGY_DIR / worksheet_file
    return _load_json_file(target_path)


def get_assessment(lesson_id: str) -> Dict[str, Any]:
    """
    Load and return assessment questions for a given lesson ID or category name.

    Args:
        lesson_id: Lesson identifier (e.g. 'class2_addition') or category (e.g. 'basic_addition').

    Returns:
        Dict containing topic, class, subject, and questions list.
    """
    all_assessments = _load_json_file(ASSESSMENTS_PATH)

    # Check if lesson_id directly matches a category
    if lesson_id in all_assessments:
        return all_assessments[lesson_id]

    # Look up category from catalog
    entry = _get_catalog_entry(lesson_id)
    category = entry.get("assessment_category")
    if not category:
        raise ValueError(f"No 'assessment_category' defined for lesson '{lesson_id}'.")

    if category not in all_assessments:
        raise KeyError(
            f"Assessment category '{category}' for lesson '{lesson_id}' not found in questions bank. "
            f"Available categories: {list(all_assessments.keys())}"
        )

    return all_assessments[category]


def get_flashcards(lesson_id: str) -> List[Dict[str, Any]]:
    """
    Load and return flashcards list for a given lesson ID or category name.

    Args:
        lesson_id: Lesson identifier (e.g. 'class1_numbers') or category (e.g. 'numbers_1_10').

    Returns:
        List of flashcard objects.
    """
    all_flashcards = _load_json_file(FLASHCARDS_PATH)

    # Check if lesson_id directly matches a category
    if lesson_id in all_flashcards:
        return all_flashcards[lesson_id]

    # Look up category from catalog
    entry = _get_catalog_entry(lesson_id)
    category = entry.get("flashcard_category")
    if not category:
        raise ValueError(f"No 'flashcard_category' defined for lesson '{lesson_id}'.")

    if category not in all_flashcards:
        raise KeyError(
            f"Flashcard category '{category}' for lesson '{lesson_id}' not found in flashcards deck. "
            f"Available categories: {list(all_flashcards.keys())}"
        )

    return all_flashcards[category]
