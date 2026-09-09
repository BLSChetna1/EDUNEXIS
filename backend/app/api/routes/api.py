"""
Unified API Router for v1 Endpoints
Aggregates all modular sub-routers so new endpoints can be cleanly introduced.
"""

from fastapi import APIRouter
from app.api.routes import chat, language, translate, speech

api_router = APIRouter()

# Include sub-routers
api_router.include_router(chat.router)
api_router.include_router(language.router)
api_router.include_router(translate.router)
api_router.include_router(speech.router)
