"""
Translation Adapter Module
Prepares pedagogy content bundles for downstream translation into Indic/tribal languages (e.g. Hindi, Bengali, Santali).
Does NOT perform translation; preserves structural schemas, question IDs, and numerical answer keys.
"""

import copy
from typing import Any, Dict, List, Set, Union


class TranslationAdapter:
    """
    Adapter that wraps educational content into a standardized translation-ready package.
    Keeps English as the ground-truth baseline while declaring translatable structures.
    """

    TRANSLATABLE_FIELDS: Set[str] = {
        "introduction",
        "teacher_activity",
        "student_activity",
        "lesson_steps",
        "classroom_activities",
        "assessment_questions",
        "homework",
        "instructions",
        "questions",
        "flashcards",
        "vocabulary",
        "explanation",
        "hint",
        "sentence",
        "meaning",
        "tasks",
        "description",
        "title",
        "question",
        "activity_name",
        "front",
        "back",
        "word",
        "taste",
    }

    PRESERVED_IMMUTABLE_FIELDS: Set[str] = {
        "id",
        "question_id",
        "question_number",
        "step_number",
        "example_number",
        "numeral",
        "answer_key",
        "correct_answer",
        "expected_answer",
        "class",
        "subject",
        "topic",
        "duration",
        "type",
        "question_type",
        "difficulty",
    }

    def __init__(self, default_source_language: str = "English") -> None:
        self.source_language = default_source_language

    def get_translatable_fields(self) -> List[str]:
        """Return the standard set of translatable educational text fields."""
        return sorted(list(self.TRANSLATABLE_FIELDS))

    def prepare_for_translation(
        self,
        content: Union[Dict[str, Any], List[Any]],
        target_language: str
    ) -> Dict[str, Any]:
        """
        Package educational content into a standardized translation payload.

        Args:
            content: The lesson/pedagogy resource dictionary (e.g. from LessonGenerator).
            target_language: Target language name (e.g., 'Hindi', 'Santali', 'Bengali').

        Returns:
            Structured dictionary containing source/target languages, cloned content, and metadata.

        Raises:
            ValueError: If target_language is invalid or content is empty.
        """
        if not target_language or not isinstance(target_language, str) or not target_language.strip():
            raise ValueError("A valid non-empty target_language string must be provided.")

        if content is None or not isinstance(content, (dict, list)):
            raise ValueError("A valid non-empty content dictionary or list must be provided.")

        cleaned_target = target_language.strip()
        is_same_language = cleaned_target.lower() in {"en", "english"}

        # Perform a deep copy so the original educational content is strictly preserved and never mutated
        content_clone = copy.deepcopy(content)

        return {
            "source_language": self.source_language,
            "target_language": cleaned_target,
            "translation_required": not is_same_language,
            "content": content_clone,
            "translatable_fields": self.get_translatable_fields(),
        }

    def extract_translatable_strings(self, content: Any) -> List[str]:
        """
        Extract all translatable human-readable text strings from a content structure,
        excluding protected IDs and numerical metadata.
        """
        extracted: List[str] = []

        def _walk(obj: Any, key_context: str = "") -> None:
            if isinstance(obj, str):
                text = obj.strip()
                # Skip short IDs, codes, single numbers, or empty strings
                if text and key_context not in self.PRESERVED_IMMUTABLE_FIELDS:
                    extracted.append(text)
            elif isinstance(obj, list):
                for item in obj:
                    _walk(item, key_context)
            elif isinstance(obj, dict):
                for k, v in obj.items():
                    if k in self.PRESERVED_IMMUTABLE_FIELDS and k not in {"tasks", "lesson_steps"}:
                        continue
                    _walk(v, k)

        _walk(content)
        return extracted
