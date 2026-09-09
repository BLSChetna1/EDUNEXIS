"""Language identification routes."""
from fastapi import APIRouter, status
from app.schemas import LanguageDetectRequest, LanguageDetectResponse
from app.services import language_detector
from language.capabilities import SUPPORTED_LANGUAGE_CAPABILITIES

router = APIRouter(prefix="/language", tags=["Language Detection"])


@router.post("/detect", response_model=LanguageDetectResponse, status_code=status.HTTP_200_OK)
async def detect_language_endpoint(request: LanguageDetectRequest) -> LanguageDetectResponse:
    """
    Detect the primary language of the submitted text.
    """
    result = language_detector.detect(request.text)
    capabilities = SUPPORTED_LANGUAGE_CAPABILITIES.get(result["language"], {})
    support_status = capabilities.get(
        "support_status",
        "supported" if result["is_supported"] else "unavailable",
    )
    return LanguageDetectResponse(
        language=capabilities.get("language", result["language"]),
        language_code=result["language"],
        regional_variant=None,
        confidence=result["confidence"],
        is_supported=support_status == "supported",
        support_status=support_status,
    )
