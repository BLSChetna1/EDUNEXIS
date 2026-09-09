"""
Unit tests for Pedagogy TeachingRecommender.
Tests pedagogical strategy recommendation, level/mode adaptations, time scaling, and error handling.
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

from pedagogy import TeachingRecommender, recommend_teaching, generate_lesson


class TestTeachingRecommender(unittest.TestCase):
    """Test suite for TeachingRecommender."""

    def setUp(self):
        self.recommender = TeachingRecommender()

    def test_class1_numbers_beginner_visual(self):
        """1. Test Class 1 Numbers with beginner level and visual mode."""
        rec = self.recommender.recommend(
            "Class 1",
            "Mathematics",
            "Numbers 1-10",
            student_level="beginner",
            learning_mode="visual"
        )

        self.assertIn("lesson", rec)
        self.assertIn("student_context", rec)
        self.assertIn("recommended_strategy", rec)
        self.assertIn("steps", rec)
        self.assertIn("activities", rec)
        self.assertIn("assessment", rec)
        self.assertIn("teacher_tips", rec)

        self.assertEqual(rec["student_context"]["level"], "beginner")
        self.assertEqual(rec["student_context"]["learning_mode"], "visual")
        self.assertIn("Scaffolding", rec["recommended_strategy"])
        self.assertIn("flashcards", rec["recommended_strategy"].lower())
        self.assertGreater(len(rec["teacher_tips"]), 0)

    def test_class1_fruits_intermediate_auditory(self):
        """2. Test Class 1 Fruits with intermediate level and auditory mode."""
        rec = self.recommender.recommend(
            "Class 1",
            "Language",
            "Fruits",
            student_level="intermediate",
            learning_mode="auditory"
        )

        self.assertEqual(rec["student_context"]["level"], "intermediate")
        self.assertEqual(rec["student_context"]["learning_mode"], "auditory")
        self.assertIn("Interactive", rec["recommended_strategy"])
        self.assertIn("verbal", rec["recommended_strategy"].lower())

    def test_class2_addition_advanced_activity_based(self):
        """3. Test Class 2 Addition with advanced level and activity_based mode."""
        rec = self.recommender.recommend(
            "Class 2",
            "Mathematics",
            "Basic Addition",
            student_level="advanced",
            learning_mode="activity_based"
        )

        self.assertEqual(rec["student_context"]["level"], "advanced")
        self.assertEqual(rec["student_context"]["learning_mode"], "activity_based")
        self.assertIn("Autonomous", rec["recommended_strategy"])
        self.assertIn("movement", rec["recommended_strategy"].lower())

    def test_mixed_learning_mode(self):
        """4. Test mixed learning mode."""
        rec = self.recommender.recommend(
            "Class 1",
            "Mathematics",
            "Numbers 1-10",
            student_level="intermediate",
            learning_mode="mixed"
        )

        self.assertEqual(rec["student_context"]["learning_mode"], "mixed")
        self.assertIn("Multi-Sensory", rec["recommended_strategy"])

    def test_invalid_student_level(self):
        """5. Test invalid student level raises ValueError."""
        with self.assertRaises(ValueError) as ctx:
            self.recommender.recommend(
                "Class 1", "Mathematics", "Numbers 1-10",
                student_level="expert"
            )
        self.assertIn("expert", str(ctx.exception))
        self.assertIn("Allowed levels", str(ctx.exception))

    def test_invalid_learning_mode(self):
        """6. Test invalid learning mode raises ValueError."""
        with self.assertRaises(ValueError) as ctx:
            self.recommender.recommend(
                "Class 1", "Mathematics", "Numbers 1-10",
                learning_mode="telepathic"
            )
        self.assertIn("telepathic", str(ctx.exception))
        self.assertIn("Allowed modes", str(ctx.exception))

    def test_invalid_lesson_or_topic(self):
        """7. Test invalid lesson parameters raise ValueError."""
        with self.assertRaises(ValueError):
            self.recommender.recommend(
                "Class 5", "Mathematics", "Calculus"
            )

    def test_time_adaptation(self):
        """8. Test adaptation of step durations to available time."""
        # 30 minute adaptation
        rec_30 = self.recommender.recommend(
            "Class 1",
            "Mathematics",
            "Numbers 1-10",
            available_time_minutes=30
        )
        total_30 = sum(step["duration_minutes"] for step in rec_30["steps"])
        self.assertEqual(total_30, 30)
        self.assertEqual(rec_30["student_context"]["available_time_minutes"], 30)

        # 15 minute adaptation
        rec_15 = self.recommender.recommend(
            "Class 1",
            "Mathematics",
            "Numbers 1-10",
            available_time_minutes=15
        )
        total_15 = sum(step["duration_minutes"] for step in rec_15["steps"])
        self.assertEqual(total_15, 15)

        # Invalid negative / zero / non-int time
        with self.assertRaises(ValueError):
            self.recommender.recommend("Class 1", "Mathematics", "Numbers 1-10", available_time_minutes=0)
        with self.assertRaises(ValueError):
            self.recommender.recommend("Class 1", "Mathematics", "Numbers 1-10", available_time_minutes=-10)

    def test_original_lesson_remains_unchanged(self):
        """9. Test that original lesson bundle is not mutated by recommender."""
        original_bundle = generate_lesson("Class 1", "Mathematics", "Numbers 1-10")
        original_snapshot = copy.deepcopy(original_bundle)

        rec = self.recommender.recommend(
            "Class 1",
            "Mathematics",
            "Numbers 1-10",
            available_time_minutes=20
        )

        # Verify raw lesson generation remains intact
        fresh_bundle = generate_lesson("Class 1", "Mathematics", "Numbers 1-10")
        self.assertEqual(fresh_bundle, original_snapshot)

    def test_convenience_function(self):
        """10. Test top-level recommend_teaching helper function."""
        rec = recommend_teaching(
            "Class 1",
            "Mathematics",
            "Numbers 1-10",
            student_level="beginner",
            learning_mode="visual",
            available_time_minutes=35
        )
        self.assertEqual(rec["lesson"]["topic"], "Numbers 1-10")
        self.assertEqual(rec["student_context"]["available_time_minutes"], 35)


if __name__ == "__main__":
    unittest.main(verbosity=2)
