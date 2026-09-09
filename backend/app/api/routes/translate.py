"""Machine translation routes for EDUNEXIS (Member 3)."""
from fastapi import APIRouter, HTTPException, status
from app.schemas import TranslateRequest, TranslateResponse
from app.services.translation_service import TranslationService, TranslationError

router = APIRouter(prefix="/translate", tags=["Translation"])


@router.post(
    "",
    response_model=TranslateResponse,
    status_code=status.HTTP_200_OK,
    summary="Translate educational content",
    description="Translates educational text between English and Indian regional languages (te, hi, ta, kn, ml, bn, mr, gu).",
)
async def translate_endpoint(request: TranslateRequest) -> TranslateResponse:
    """
    Translate educational content across supported Indic and international languages.
    """
    try:
        result = await TranslationService.translate(
            text=request.text,
            source_lang=request.source_language or "auto",
            target_lang=request.target_language,
        )
        return TranslateResponse(**result)
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(err),
        )
    except TranslationError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(err),
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation processing error: {str(err)}",
        )

