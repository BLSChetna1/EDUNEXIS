"""
Unit tests for Pedagogy LessonGenerator.
Tests lesson generation across all subjects, topic listing, filters, and error cases.
"""

import sys
import unittest
from pathlib import Path

# Add ai-engine to sys.path
repo_root = Path(__file__).resolve().parent.parent
ai_engine_path = repo_root / "ai-engine"
if str(ai_engine_path) not in sys.path:
    sys.path.insert(0, str(ai_engine_path))

from pedagogy import LessonGenerator, generate_lesson


class TestLessonGenerator(unittest.TestCase):
    """Test suite for LessonGenerator."""

    def setUp(self):
        self.generator = LessonGenerator()

    def test_class1_mathematics_numbers(self):
        """1. Test Class 1 + Mathematics + Numbers 1-10 generation."""
        bundle = self.generator.generate_lesson("Class 1", "Mathematics", "Numbers 1-10")

        self.assertIn("lesson", bundle)
        self.assertIn("worksheet", bundle)
        self.assertIn("assessment", bundle)
        self.assertIn("flashcards", bundle)

        self.assertEqual(bundle["lesson"]["class"], "Class 1")
        self.assertEqual(bundle["lesson"]["subject"], "Mathematics")
        self.assertEqual(bundle["lesson"]["topic"], "Numbers 1-10")
        self.assertEqual(len(bundle["worksheet"]["questions"]), 5)
        self.assertGreater(len(bundle["flashcards"]), 0)

    def test_class1_language_fruits(self):
        """2. Test Class 1 + Language + Fruits generation."""
        bundle = self.generator.generate_lesson("Class 1", "Language", "Fruits")

        self.assertIn("lesson", bundle)
        self.assertIn("worksheet", bundle)
        self.assertIn("assessment", bundle)
        self.assertIn("flashcards", bundle)

        self.assertEqual(bundle["lesson"]["class"], "Class 1")
        self.assertEqual(bundle["lesson"]["subject"], "Language")
        self.assertEqual(bundle["lesson"]["topic"], "Fruits")
        self.assertEqual(len(bundle["worksheet"]["questions"]), 5)
        self.assertGreater(len(bundle["flashcards"]), 0)

    def test_class2_mathematics_addition(self):
        """3. Test Class 2 + Mathematics + Basic Addition generation."""
        bundle = self.generator.generate_lesson("Class 2", "Mathematics", "Basic Addition")

        self.assertIn("lesson", bundle)
        self.assertIn("worksheet", bundle)
        self.assertIn("assessment", bundle)
        self.assertIn("flashcards", bundle)

        self.assertEqual(bundle["lesson"]["class"], "Class 2")
        self.assertEqual(bundle["lesson"]["subject"], "Mathematics")
        self.assertEqual(bundle["lesson"]["topic"], "Basic Addition")
        self.assertEqual(len(bundle["worksheet"]["questions"]), 5)
        self.assertGreater(len(bundle["flashcards"]), 0)

    def test_convenience_function(self):
        """Test top-level generate_lesson helper function."""
        bundle = generate_lesson("Class 1", "Mathematics", "Numbers 1-10")
        self.assertEqual(bundle["lesson"]["topic"], "Numbers 1-10")

    def test_invalid_topic_and_errors(self):
        """4. Test Invalid topic, class, and subject error handling."""
        # Invalid topic
        with self.assertRaises(ValueError) as ctx:
            self.generator.generate_lesson("Class 1", "Mathematics", "Quantum Mechanics")
        self.assertIn("Quantum Mechanics", str(ctx.exception))
        self.assertIn("Available topics", str(ctx.exception))

        # Invalid class
        with self.assertRaises(ValueError) as ctx:
            self.generator.generate_lesson("Class 10", "Mathematics", "Numbers 1-10")
        self.assertIn("Class 10", str(ctx.exception))
        self.assertIn("Available classes", str(ctx.exception))

        # Invalid subject for existing class
        with self.assertRaises(ValueError) as ctx:
            self.generator.generate_lesson("Class 1", "Physics", "Numbers 1-10")
        self.assertIn("Physics", str(ctx.exception))
        self.assertIn("Available subjects", str(ctx.exception))

    def test_topic_listing(self):
        """5. Test Topic listing without filters."""
        topics = self.generator.list_topics()
        self.assertGreaterEqual(len(topics), 6)
        topic_names = [t["topic"] for t in topics]
        self.assertIn("Numbers 1-10", topic_names)
        self.assertIn("Fruits", topic_names)
        self.assertIn("Basic Addition", topic_names)
        self.assertIn("Multiplication Tables 2-5", topic_names)

    def test_filtering_by_class(self):
        """6. Test Filtering by class."""
        c1_topics = self.generator.list_topics(class_name="Class 1")
        self.assertEqual(len(c1_topics), 2)
        for t in c1_topics:
            self.assertEqual(t["class"], "Class 1")

        c2_topics = self.generator.list_topics(class_name="Class 2")
        self.assertEqual(len(c2_topics), 1)
        self.assertEqual(c2_topics[0]["topic"], "Basic Addition")

        c3_topics = self.generator.list_topics(class_name="Class 3")
        self.assertGreaterEqual(len(c3_topics), 1)
        self.assertIn("Multiplication Tables 2-5", [t["topic"] for t in c3_topics])

    def test_filtering_by_subject(self):
        """7. Test Filtering by subject."""
        math_topics = self.generator.list_topics(subject="Mathematics")
        self.assertGreaterEqual(len(math_topics), 3)
        for t in math_topics:
            self.assertEqual(t["subject"], "Mathematics")

        lang_topics = self.generator.list_topics(subject="Language")
        self.assertEqual(len(lang_topics), 1)
        self.assertEqual(lang_topics[0]["topic"], "Fruits")

        both_filter = self.generator.list_topics(class_name="Class 1", subject="Mathematics")
        self.assertEqual(len(both_filter), 1)
        self.assertEqual(both_filter[0]["topic"], "Numbers 1-10")

    def test_class3_mathematics_generation(self):
        """8. Test Class 3 + Mathematics generation exists and keeps the standard bundle format."""
        bundle = self.generator.generate_lesson("Class 3", "Mathematics", "Multiplication Tables 2-5")
        self.assertEqual(bundle["lesson"]["class"], "Class 3")
        self.assertEqual(bundle["lesson"]["subject"], "Mathematics")
        self.assertEqual(bundle["lesson"]["topic"], "Multiplication Tables 2-5")
        self.assertGreater(len(bundle["flashcards"]), 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
