"""Language identification routes."""
from fastapi import APIRouter, status
from app.schemas import LanguageDetectRequest, LanguageDetectResponse

router = APIRouter(prefix="/language", tags=["Language Detection"])


@router.post("/detect", response_model=LanguageDetectResponse, status_code=status.HTTP_200_OK)
async def detect_language_endpoint(request: LanguageDetectRequest) -> LanguageDetectResponse:
    """
    Detect the primary language of the submitted text.
    """
    # Placeholder rule-based detection response
    return LanguageDetectResponse(
        language="en",
        confidence=0.98,
        is_supported=True,
    )
