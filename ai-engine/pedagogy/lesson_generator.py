"""
Lesson Generation Module
Combines curriculum lessons, worksheets, assessments, and flashcards into a unified educational package.
"""

from typing import Any, Dict, List, Optional
from .content_loader import (
    get_available_lessons,
    get_lesson,
    get_worksheet,
    get_assessment,
    get_flashcards,
)


class LessonGenerator:
    """Generates structured pedagogical content bundles from verified educational resources."""

    def __init__(self) -> None:
        pass

    def list_topics(
        self,
        class_name: Optional[str] = None,
        subject: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        List all available lessons and topics, with optional filtering by class and subject.

        Args:
            class_name: Optional class filter (e.g., 'Class 1', 'class 1').
            subject: Optional subject filter (e.g., 'Mathematics', 'Language').

        Returns:
            List of summary dicts with id, class, subject, and topic.
        """
        all_lessons = get_available_lessons()
        filtered = []

        for item in all_lessons:
            item_class = item.get("class", "")
            item_subject = item.get("subject", "")

            if class_name and item_class.strip().lower() != class_name.strip().lower():
                continue
            if subject and item_subject.strip().lower() != subject.strip().lower():
                continue

            filtered.append({
                "id": item.get("id"),
                "class": item_class,
                "subject": item_subject,
                "topic": item.get("topic"),
            })

        return filtered

    def generate_lesson(
        self,
        class_name: str,
        subject: str,
        topic: str
    ) -> Dict[str, Any]:
        """
        Generate a comprehensive educational resource package for a given class, subject, and topic.

        Args:
            class_name: Class name (e.g., 'Class 1', 'Class 2').
            subject: Subject name (e.g., 'Mathematics', 'Language').
            topic: Educational topic (e.g., 'Numbers 1-10', 'Fruits', 'Basic Addition').

        Returns:
            Dict containing lesson plan, worksheet, assessment questions, and flashcards.

        Raises:
            ValueError: If class, subject, or topic inputs are empty or not found in catalog.
        """
        if not class_name or not isinstance(class_name, str):
            raise ValueError("A valid non-empty string class_name must be provided.")
        if not subject or not isinstance(subject, str):
            raise ValueError("A valid non-empty string subject must be provided.")
        if not topic or not isinstance(topic, str):
            raise ValueError("A valid non-empty string topic must be provided.")

        all_lessons = get_available_lessons()

        # Step 1: Validate Class existence
        matching_class_lessons = [
            l for l in all_lessons
            if l.get("class", "").strip().lower() == class_name.strip().lower()
        ]
        if not matching_class_lessons:
            available_classes = sorted(list({l.get("class") for l in all_lessons if "class" in l}))
            raise ValueError(
                f"Class '{class_name}' does not exist. Available classes: {available_classes}"
            )

        # Step 2: Validate Subject existence for the specified Class
        matching_subject_lessons = [
            l for l in matching_class_lessons
            if l.get("subject", "").strip().lower() == subject.strip().lower()
        ]
        if not matching_subject_lessons:
            available_subjects = sorted(list({l.get("subject") for l in matching_class_lessons if "subject" in l}))
            raise ValueError(
                f"Subject '{subject}' not found for '{class_name}'. "
                f"Available subjects for {class_name}: {available_subjects}"
            )

        # Step 3: Validate Topic existence for the specified Class and Subject
        matched_entry = None
        for l in matching_subject_lessons:
            if l.get("topic", "").strip().lower() == topic.strip().lower():
                matched_entry = l
                break

        if not matched_entry:
            available_topics = [l.get("topic") for l in matching_subject_lessons if "topic" in l]
            raise ValueError(
                f"Topic '{topic}' does not exist for {class_name} - {subject}. "
                f"Available topics: {available_topics}"
            )

        lesson_id = matched_entry["id"]

        # Step 4: Load and bundle all pedagogical resources
        lesson_content = get_lesson(lesson_id)
        worksheet_content = get_worksheet(lesson_id)
        assessment_content = get_assessment(lesson_id)
        flashcards_content = get_flashcards(lesson_id)

        return {
            "lesson": lesson_content,
            "worksheet": worksheet_content,
            "assessment": assessment_content,
            "flashcards": flashcards_content,
        }


def generate_lesson(class_name: str, subject: str, topic: str) -> Dict[str, Any]:
    """
    Convenience helper function to generate a lesson package.

    Args:
        class_name: Class/Grade level (e.g. 'Class 1').
        subject: Subject (e.g. 'Mathematics').
        topic: Topic (e.g. 'Numbers 1-10').

    Returns:
        Structured dictionary containing lesson, worksheet, assessment, and flashcards.
    """
    generator = LessonGenerator()
    return generator.generate_lesson(class_name, subject, topic)
