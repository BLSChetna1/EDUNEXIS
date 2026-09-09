"""
Database Models (Architecture Ready)
Define entity data structures for persistence when database is provisioned.
"""

from typing import Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    """User profile entity placeholder."""
    id: Optional[int] = None
    email: str = ""
    preferred_language: str = "en"
    created_at: Optional[datetime] = None


@dataclass
class LearningSession:
    """Student tutoring session record placeholder."""
    id: Optional[int] = None
    user_id: Optional[int] = None
    topic: str = ""
    simplified_level: str = "standard"
    created_at: Optional[datetime] = None
