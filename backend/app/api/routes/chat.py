"""Chat and pedagogical query routes."""
from fastapi import APIRouter, HTTPException, status
from app.schemas import ChatRequest, ChatResponse
from app.services import AiPipelineError, BackendAiService

router = APIRouter(prefix="/chat", tags=["Chat & Pedagogy"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    Process student input query through pedagogical simplification and LLM reasoning.
    """
    try:
        result = await BackendAiService.process_chat(
            message=request.message,
            target_lang=request.target_language or "en",
            pedagogy_level=request.pedagogy_level or "standard",
            session_id=request.session_id,
        )
    except TimeoutError as error:
        raise HTTPException(status_code=504, detail="The tutor took too long to respond. Please try again.") from error
    except (AiPipelineError, ValueError) as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
    return ChatResponse(**result)
