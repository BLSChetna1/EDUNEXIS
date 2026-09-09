"""Pedagogy module initialization."""
from .simplifier import PedagogySimplifier
from .content_loader import (
    load_catalog,
    get_available_lessons,
    get_lesson,
    get_worksheet,
    get_assessment,
    get_flashcards,
)
from .lesson_generator import LessonGenerator, generate_lesson
from .translation_adapter import TranslationAdapter
from .teaching_recommender import TeachingRecommender, recommend_teaching
from .demo import run_pedagogy_demo, print_pedagogy_demo, demo_numbers_lesson

__all__ = [
    "PedagogySimplifier",
    "load_catalog",
    "get_available_lessons",
    "get_lesson",
    "get_worksheet",
    "get_assessment",
    "get_flashcards",
    "LessonGenerator",
    "generate_lesson",
    "TranslationAdapter",
    "TeachingRecommender",
    "recommend_teaching",
    "run_pedagogy_demo",
    "print_pedagogy_demo",
    "demo_numbers_lesson",
]




