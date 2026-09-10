"""
Database Session & Connection Management (Placeholder)
Architecture-ready module designed to plug in SQLAlchemy/PostgreSQL.
"""

from typing import Generator
from app.core.config import settings


def get_db() -> Generator:
    """
    Dependency generator for database sessions.
    Once DATABASE_URL is configured, initialize sessionmaker and yield sessions.
    """
    if not settings.DATABASE_URL:
        # Currently running in detached/memory mode for early development
        yield None
        return

    # Placeholder for future ORM session yield:
    # db = SessionLocal()
    # try:
    #     yield db
    # finally:
    #     db.close()
    yield None
