"""
Teaching Recommendation Engine Module
Generates deterministic, pedagogically tailored teaching recommendations
customized by student level, sensory learning mode, and available class duration.
"""

import copy
import re
from typing import Any, Dict, List, Optional
from .lesson_generator import LessonGenerator


class TeachingRecommender:
    """Provides deterministic pedagogical strategies, timing adaptations, and teaching tips."""

    VALID_STUDENT_LEVELS = {"beginner", "intermediate", "advanced"}
    VALID_LEARNING_MODES = {"visual", "auditory", "activity_based", "mixed"}

    LEVEL_STRATEGIES = {
        "beginner": (
            "Foundational Scaffolding: Use high visual and physical demonstration, slow pacing, "
            "frequent positive reinforcement, and repetitive concept anchoring."
        ),
        "intermediate": (
            "Guided Interactive Practice: Combine structured teacher modeling with active student "
            "participation, partner discussions, and immediate formative check-ins."
        ),
        "advanced": (
            "Autonomous Exploration: Encourage independent problem solving, student-led peer "
            "explanations, multi-step challenge problems, and creative concept applications."
        ),
    }

    MODE_FOCUS = {
        "visual": "Prioritize flashcards, board illustrations, color-coded counters, and visual charts.",
        "auditory": "Emphasize verbal repetition, counting rhymes, pronunciation modeling, and call-and-response chants.",
        "activity_based": "Incorporate kinesthetic movement, physical counters, floor games, and hands-on partner activities.",
        "mixed": "Multi-Sensory Blend: Integrate visual flashcards, oral chants, and physical movement for maximum retention.",
    }

    LEVEL_TIPS = {
        "beginner": [
            "Break instructions into single, bite-sized spoken steps.",
            "Use physical gestures and relatable everyday classroom objects.",
            "Praise effort consistently to build confidence in young learners.",
            "Check comprehension frequently using thumbs-up/thumbs-down signals."
        ],
        "intermediate": [
            "Encourage students to explain their thinking in simple sentences.",
            "Pair students for collaborative worksheet problem solving.",
            "Provide immediate constructive feedback during guided exercises."
        ],
        "advanced": [
            "Ask 'Why?' and 'How do you know?' to foster deeper conceptual reasoning.",
            "Give early finishers challenge extension questions from the assessment bank.",
            "Allow advanced students to demonstrate solutions to their peers on the board."
        ],
    }

    MODE_TIPS = {
        "visual": [
            "Display large, colorful flashcards at eye level for all students.",
            "Draw clear, uncluttered symbols and tallies on the blackboard.",
            "Use distinct color markers for numerals vs. objects."
        ],
        "auditory": [
            "Repeat key vocabulary words with varied pitch and rhythm.",
            "Use rhythmic clapping to count syllables and numbers together.",
            "Invite choral responses from the entire classroom."
        ],
        "activity_based": [
            "Clear space for students to move and participate safely.",
            "Distribute physical counting counters or real objects before beginning.",
            "Use floor number line jumps and physical roleplay games."
        ],
        "mixed": [
            "Combine visual flashcard displays with spoken chants and finger counting.",
            "Transition smoothly between seated observation and active physical practice."
        ],
    }

    def __init__(self) -> None:
        self.generator = LessonGenerator()

    def _parse_step_minutes(self, duration_str: str, default: int = 5) -> int:
        """Extract integer minutes from duration strings like '10 minutes' or '5 mins'."""
        match = re.search(r"\d+", duration_str)
        return int(match.group()) if match else default

    def _adapt_timings(
        self,
        lesson_steps: List[Dict[str, Any]],
        available_time_minutes: Optional[int]
    ) -> List[Dict[str, Any]]:
        """
        Adapt step durations to strictly match the requested available time
        while preserving step sequences and pedagogical flow.
        """
        if not lesson_steps:
            return []

        # Extract original minutes per step
        original_minutes = [
            self._parse_step_minutes(step.get("duration", "5 minutes"))
            for step in lesson_steps
        ]
        total_original = sum(original_minutes) or 40

        if available_time_minutes is None:
            # Return original durations formatted cleanly
            adapted_steps = []
            for i, step in enumerate(lesson_steps):
                step_copy = copy.deepcopy(step)
                step_copy["duration_minutes"] = original_minutes[i]
                step_copy["duration"] = f"{original_minutes[i]} minutes"
                adapted_steps.append(step_copy)
            return adapted_steps

        target_total = available_time_minutes
        num_steps = len(lesson_steps)

        # Distribute target minutes proportionally
        scaled_minutes: List[int] = []
        for orig in original_minutes:
            scaled = max(1, round((orig / total_original) * target_total))
            scaled_minutes.append(scaled)

        # Adjust the sum to match target_total exactly
        diff = target_total - sum(scaled_minutes)
        idx = 0
        while diff != 0 and num_steps > 0:
            if diff > 0:
                scaled_minutes[idx % num_steps] += 1
                diff -= 1
            elif diff < 0 and scaled_minutes[idx % num_steps] > 1:
                scaled_minutes[idx % num_steps] -= 1
                diff += 1
            idx += 1

        adapted_steps = []
        for i, step in enumerate(lesson_steps):
            step_copy = copy.deepcopy(step)
            step_copy["duration_minutes"] = scaled_minutes[i]
            step_copy["duration"] = f"{scaled_minutes[i]} minutes"
            adapted_steps.append(step_copy)

        return adapted_steps

    def _select_assessments(
        self,
        assessment_bundle: Dict[str, Any],
        student_level: str
    ) -> List[Dict[str, Any]]:
        """Filter and prioritize assessment questions tailored to student competency level."""
        questions = assessment_bundle.get("questions", [])
        if not questions:
            return []

        if student_level == "beginner":
            # Prefer easy and counting/multiple-choice questions
            filtered = [q for q in questions if q.get("difficulty") == "easy"]
            return filtered if filtered else questions[:2]
        elif student_level == "advanced":
            # Prefer medium/hard word-problems and fill-in-the-blank questions
            filtered = [q for q in questions if q.get("difficulty") in {"medium", "hard"}]
            return filtered if filtered else questions[-2:]
        else:
            # Intermediate gets standard balanced selection
            return questions[:3]

    def recommend(
        self,
        class_name: str,
        subject: str,
        topic: str,
        student_level: str = "beginner",
        learning_mode: str = "visual",
        available_time_minutes: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Generate a comprehensive, tailored teaching plan and pedagogical recommendation.

        Args:
            class_name: Grade level (e.g. 'Class 1', 'Class 2').
            subject: Subject area (e.g. 'Mathematics', 'Language').
            topic: Topic (e.g. 'Numbers 1-10', 'Fruits', 'Basic Addition').
            student_level: Student readiness tier ('beginner', 'intermediate', 'advanced').
            learning_mode: Sensory modality ('visual', 'auditory', 'activity_based', 'mixed').
            available_time_minutes: Optional available period length in minutes.

        Returns:
            Dict containing lesson metadata, student context, strategy, adapted steps,
            activities, tailored assessment, and teacher tips.

        Raises:
            ValueError: If any input parameters are invalid or out of allowed bounds.
        """
        # 1. Input Validation
        if not student_level or not isinstance(student_level, str):
            raise ValueError(
                f"Invalid student_level '{student_level}'. Allowed levels: {sorted(list(self.VALID_STUDENT_LEVELS))}"
            )
        lvl = student_level.strip().lower()
        if lvl not in self.VALID_STUDENT_LEVELS:
            raise ValueError(
                f"Invalid student_level '{student_level}'. Allowed levels: {sorted(list(self.VALID_STUDENT_LEVELS))}"
            )

        if not learning_mode or not isinstance(learning_mode, str):
            raise ValueError(
                f"Invalid learning_mode '{learning_mode}'. Allowed modes: {sorted(list(self.VALID_LEARNING_MODES))}"
            )
        mode = learning_mode.strip().lower()
        if mode not in self.VALID_LEARNING_MODES:
            raise ValueError(
                f"Invalid learning_mode '{learning_mode}'. Allowed modes: {sorted(list(self.VALID_LEARNING_MODES))}"
            )

        if available_time_minutes is not None:
            if not isinstance(available_time_minutes, int) or isinstance(available_time_minutes, bool) or available_time_minutes <= 0:
                raise ValueError(
                    f"available_time_minutes must be a positive integer, got: {available_time_minutes}"
                )

        # 2. Load verified lesson bundle from LessonGenerator
        bundle = self.generator.generate_lesson(class_name, subject, topic)
        raw_lesson = bundle["lesson"]
        raw_assessment = bundle["assessment"]

        # Determine effective duration
        original_duration_min = self._parse_step_minutes(raw_lesson.get("duration", "40 minutes"))
        effective_duration = available_time_minutes if available_time_minutes is not None else original_duration_min

        # 3. Formulate Strategy and Teacher Tips
        strategy = (
            f"{self.LEVEL_STRATEGIES[lvl]} Mode Emphasis: {self.MODE_FOCUS[mode]}"
        )

        teacher_tips = []
        teacher_tips.extend(self.LEVEL_TIPS.get(lvl, []))
        teacher_tips.extend(self.MODE_TIPS.get(mode, []))

        # 4. Adapt Timings for Lesson Steps
        adapted_steps = self._adapt_timings(
            raw_lesson.get("lesson_steps", []),
            available_time_minutes
        )

        # 5. Tailor Assessment Questions
        tailored_assessment = self._select_assessments(raw_assessment, lvl)

        # 6. Extract Activities
        activities = copy.deepcopy(raw_lesson.get("classroom_activities", []))

        # 7. Assemble Structured Recommendation Payload
        return {
            "lesson": {
                "class": raw_lesson.get("class"),
                "subject": raw_lesson.get("subject"),
                "topic": raw_lesson.get("topic"),
                "learning_objectives": copy.deepcopy(raw_lesson.get("learning_objectives", [])),
                "introduction": raw_lesson.get("introduction"),
            },
            "student_context": {
                "level": lvl,
                "learning_mode": mode,
                "available_time_minutes": effective_duration,
            },
            "recommended_strategy": strategy,
            "steps": adapted_steps,
            "activities": activities,
            "assessment": tailored_assessment,
            "teacher_tips": teacher_tips,
        }


def recommend_teaching(
    class_name: str,
    subject: str,
    topic: str,
    student_level: str = "beginner",
    learning_mode: str = "visual",
    available_time_minutes: Optional[int] = None
) -> Dict[str, Any]:
    """
    Convenience function for generating AI teaching recommendations.

    Args:
        class_name: Grade level (e.g. 'Class 1').
        subject: Subject (e.g. 'Mathematics').
        topic: Topic (e.g. 'Numbers 1-10').
        student_level: 'beginner', 'intermediate', or 'advanced'.
        learning_mode: 'visual', 'auditory', 'activity_based', or 'mixed'.
        available_time_minutes: Optional time constraint in minutes.

    Returns:
        Structured recommendation dictionary.
    """
    recommender = TeachingRecommender()
    return recommender.recommend(
        class_name=class_name,
        subject=subject,
        topic=topic,
        student_level=student_level,
        learning_mode=learning_mode,
        available_time_minutes=available_time_minutes,
    )
