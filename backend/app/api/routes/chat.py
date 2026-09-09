"""Chat and pedagogical query routes."""
from fastapi import APIRouter, status
from app.schemas import ChatRequest, ChatResponse
from app.services import BackendAiService

router = APIRouter(prefix="/chat", tags=["Chat & Pedagogy"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    Process student input query through pedagogical simplification and LLM reasoning.
    """
    result = await BackendAiService.process_chat(
        message=request.message,
        target_lang=request.target_language or "en",
        pedagogy_level=request.pedagogy_level or "standard",
    )
    return ChatResponse(**result)
