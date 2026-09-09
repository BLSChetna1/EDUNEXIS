"""
Unit tests for Pedagogy Demo Interface.
Tests end-to-end pedagogy bundling, request/response structures, immutability, and convenience demos.
"""

import copy
import sys
import unittest
from pathlib import Path

# Add ai-engine to sys.path
repo_root = Path(__file__).resolve().parent.parent
ai_engine_path = repo_root / "ai-engine"
if str(ai_engine_path) not in sys.path:
    sys.path.insert(0, str(ai_engine_path))

from pedagogy import (
    run_pedagogy_demo,
    print_pedagogy_demo,
    demo_numbers_lesson,
    generate_lesson,
)


class TestPedagogyDemo(unittest.TestCase):
    """Test suite for pedagogy demonstration interface."""

    def test_run_pedagogy_demo_structure(self):
        """1-9. Test run_pedagogy_demo returns complete, valid structured package."""
        demo_out = run_pedagogy_demo(
            class_name="Class 1",
            subject="Mathematics",
            topic="Numbers 1-10",
            student_level="beginner",
            learning_mode="visual",
            available_time_minutes=30,
            target_language="Hindi"
        )

        # 1. Returns a dictionary
        self.assertIsInstance(demo_out, dict)

        # 2. Correct class
        self.assertEqual(demo_out["request"]["class_name"], "Class 1")
        self.assertEqual(demo_out["lesson"]["lesson"]["class"], "Class 1")

        # 3. Correct subject
        self.assertEqual(demo_out["request"]["subject"], "Mathematics")
        self.assertEqual(demo_out["lesson"]["lesson"]["subject"], "Mathematics")

        # 4. Correct topic
        self.assertEqual(demo_out["request"]["topic"], "Numbers 1-10")
        self.assertEqual(demo_out["lesson"]["lesson"]["topic"], "Numbers 1-10")

        # 5. Student context is preserved
        self.assertEqual(demo_out["request"]["student_level"], "beginner")
        self.assertEqual(demo_out["request"]["learning_mode"], "visual")
        self.assertEqual(demo_out["request"]["available_time_minutes"], 30)

        # 6. Lesson is included (all sub-resources present)
        self.assertIn("lesson", demo_out)
        self.assertIn("worksheet", demo_out["lesson"])
        self.assertIn("assessment", demo_out["lesson"])
        self.assertIn("flashcards", demo_out["lesson"])

        # 7. Teaching recommendation is included
        self.assertIn("teaching_recommendation", demo_out)
        self.assertIn("recommended_strategy", demo_out["teaching_recommendation"])
        self.assertIn("steps", demo_out["teaching_recommendation"])
        self.assertIn("teacher_tips", demo_out["teaching_recommendation"])

        # 8. Translation package is included
        self.assertIn("translation_package", demo_out)
        self.assertEqual(demo_out["translation_package"]["source_language"], "English")

        # 9. Target language is preserved
        self.assertEqual(demo_out["request"]["target_language"], "Hindi")
        self.assertEqual(demo_out["translation_package"]["target_language"], "Hindi")
        self.assertTrue(demo_out["translation_package"]["translation_required"])

    def test_original_lesson_data_not_modified(self):
        """10. Test that running demo does not modify original baseline lesson data."""
        base_before = generate_lesson("Class 1", "Mathematics", "Numbers 1-10")
        snapshot_before = copy.deepcopy(base_before)

        demo_out = run_pedagogy_demo(
            class_name="Class 1",
            subject="Mathematics",
            topic="Numbers 1-10",
            student_level="advanced",
            learning_mode="activity_based",
            available_time_minutes=15,
            target_language="Santali"
        )

        base_after = generate_lesson("Class 1", "Mathematics", "Numbers 1-10")
        self.assertEqual(base_after, snapshot_before)

    def test_invalid_lesson_parameters_raise_error(self):
        """11. Test that invalid parameters raise descriptive ValueError."""
        with self.assertRaises(ValueError):
            run_pedagogy_demo(
                class_name="NonExistentClass",
                subject="Mathematics",
                topic="Numbers 1-10"
            )

        with self.assertRaises(ValueError):
            run_pedagogy_demo(
                class_name="Class 1",
                subject="Mathematics",
                topic="Numbers 1-10",
                student_level="super_advanced"
            )

    def test_demo_numbers_lesson(self):
        """12. Test demo_numbers_lesson convenience function."""
        demo_out = demo_numbers_lesson()
        self.assertIsInstance(demo_out, dict)
        self.assertEqual(demo_out["request"]["class_name"], "Class 1")
        self.assertEqual(demo_out["request"]["subject"], "Mathematics")
        self.assertEqual(demo_out["request"]["topic"], "Numbers 1-10")
        self.assertEqual(demo_out["request"]["target_language"], "Hindi")
        self.assertEqual(demo_out["request"]["available_time_minutes"], 30)

    def test_class3_demo_with_hindi_target_language(self):
        """13. Class 3 Mathematics demo bundles a valid lesson and the required Hindi translation metadata."""
        demo_out = run_pedagogy_demo(
            class_name="Class 3",
            subject="Mathematics",
            topic="Multiplication Tables 2-5",
            student_level="beginner",
            learning_mode="visual",
            available_time_minutes=30,
            target_language="Hindi"
        )
        self.assertEqual(demo_out["request"]["class_name"], "Class 3")
        self.assertEqual(demo_out["request"]["subject"], "Mathematics")
        self.assertEqual(demo_out["request"]["topic"], "Multiplication Tables 2-5")
        self.assertEqual(demo_out["translation_package"]["target_language"], "Hindi")
        self.assertTrue(demo_out["translation_package"]["translation_required"])
        self.assertIn("recommended_strategy", demo_out["teaching_recommendation"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
