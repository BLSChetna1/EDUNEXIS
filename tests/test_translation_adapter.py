"""
Unit tests for Pedagogy TranslationAdapter.
Tests translation-ready payload creation, deep copying, schema preservation, and error handling.
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

from pedagogy import generate_lesson, TranslationAdapter


class TestTranslationAdapter(unittest.TestCase):
    """Test suite for TranslationAdapter."""

    def setUp(self):
        self.adapter = TranslationAdapter()
        self.lesson_bundle = generate_lesson("Class 1", "Mathematics", "Numbers 1-10")

    def test_prepare_for_hindi_translation(self):
        """1. Test English content packaged for Hindi target language."""
        result = self.adapter.prepare_for_translation(self.lesson_bundle, "Hindi")

        self.assertEqual(result["source_language"], "English")
        self.assertEqual(result["target_language"], "Hindi")
        self.assertTrue(result["translation_required"])
        self.assertIn("content", result)
        self.assertIn("translatable_fields", result)

    def test_prepare_for_english_no_translation_needed(self):
        """2. Test English target does not require translation."""
        result = self.adapter.prepare_for_translation(self.lesson_bundle, "English")
        self.assertFalse(result["translation_required"])

    def test_required_tribal_target_languages_package_correctly(self):
        """2a. Confirm the required Jharkhand target language set is accepted and keeps English as source only."""
        for lang in ["Hindi", "Santhali", "Ho (Warang Chiti)", "Mundari (Bani Hisir)"]:
            result = self.adapter.prepare_for_translation(self.lesson_bundle, lang)
            self.assertEqual(result["source_language"], "English")
            self.assertEqual(result["target_language"], lang)
            self.assertTrue(result["translation_required"])

    def test_original_content_is_unmutated_deep_copy(self):
        """3. Test that original lesson bundle is unchanged when payload content is modified."""
        original_copy = copy.deepcopy(self.lesson_bundle)
        result = self.adapter.prepare_for_translation(self.lesson_bundle, "Santali")

        # Mutate the prepared payload
        result["content"]["lesson"]["topic"] = "MODIFIED_TOPIC"

        # Verify the original bundle is completely unaffected
        self.assertEqual(self.lesson_bundle["lesson"]["topic"], "Numbers 1-10")
        self.assertEqual(self.lesson_bundle, original_copy)

    def test_all_sections_preserved(self):
        """4. Test all major educational sections are preserved in payload."""
        result = self.adapter.prepare_for_translation(self.lesson_bundle, "Bengali")
        content = result["content"]

        self.assertIn("lesson", content)
        self.assertIn("worksheet", content)
        self.assertIn("assessment", content)
        self.assertIn("flashcards", content)

        self.assertEqual(content["lesson"]["class"], "Class 1")
        self.assertEqual(content["lesson"]["subject"], "Mathematics")
        self.assertEqual(content["lesson"]["topic"], "Numbers 1-10")

    def test_numerical_answers_and_ids_preserved(self):
        """5. Test question IDs, answer keys, and numeric values remain identical."""
        result = self.adapter.prepare_for_translation(self.lesson_bundle, "Telugu")
        content = result["content"]

        # Check worksheet answer key
        self.assertEqual(
            content["worksheet"]["answer_key"],
            self.lesson_bundle["worksheet"]["answer_key"]
        )

        # Check assessment questions IDs
        orig_q_ids = [q["id"] for q in self.lesson_bundle["assessment"]["questions"]]
        prep_q_ids = [q["id"] for q in content["assessment"]["questions"]]
        self.assertEqual(orig_q_ids, prep_q_ids)

        # Check flashcards numerals
        orig_nums = [fc.get("numeral") for fc in self.lesson_bundle["flashcards"]]
        prep_nums = [fc.get("numeral") for fc in content["flashcards"]]
        self.assertEqual(orig_nums, prep_nums)

    def test_invalid_target_language_raises_error(self):
        """6. Test empty, None, or whitespace target language raises ValueError."""
        with self.assertRaises(ValueError):
            self.adapter.prepare_for_translation(self.lesson_bundle, "")

        with self.assertRaises(ValueError):
            self.adapter.prepare_for_translation(self.lesson_bundle, "   ")

        with self.assertRaises(ValueError):
            self.adapter.prepare_for_translation(self.lesson_bundle, None)  # type: ignore

    def test_invalid_content_raises_error(self):
        """7. Test invalid content raises ValueError."""
        with self.assertRaises(ValueError):
            self.adapter.prepare_for_translation(None, "Hindi")  # type: ignore

    def test_extract_translatable_strings(self):
        """8. Test extraction of translatable strings without modifying structures."""
        strings = self.adapter.extract_translatable_strings(self.lesson_bundle)
        self.assertIsInstance(strings, list)
        self.assertGreater(len(strings), 10)
        # Check that common intro/rhyme text is found
        found_intro = any("Welcome students" in s for s in strings)
        self.assertTrue(found_intro)


if __name__ == "__main__":
    unittest.main(verbosity=2)
