"""Machine translation routes."""
from fastapi import APIRouter, status
from app.schemas import TranslateRequest, TranslateResponse
from app.services import TranslationService

router = APIRouter(prefix="/translate", tags=["Translation"])


@router.post("", response_model=TranslateResponse, status_code=status.HTTP_200_OK)
async def translate_endpoint(request: TranslateRequest) -> TranslateResponse:
    """
    Translate educational content across supported Indic and international languages.
    """
    result = await TranslationService.translate(
        text=request.text,
        source_lang=request.source_language or "auto",
        target_lang=request.target_language,
    )
    return TranslateResponse(**result)
