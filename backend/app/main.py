"""
EDUNEXIS Backend API Application
FastAPI application entrypoint providing core health endpoints and mounting v1 routes.
"""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.api import api_router
from app.schemas import HealthResponse, RootResponse

# Initialize FastAPI application
app = FastAPI(
    title="EDUNEXIS API",
    description="Backend API services for EDUNEXIS - Multilingual AI Adaptive Learning Platform (SIH 2026)",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    response_model=RootResponse,
    status_code=status.HTTP_200_OK,
    tags=["Root"],
    summary="API Root Information",
)
async def root() -> RootResponse:
    """
    Root endpoint returning basic metadata and interactive documentation URL.
    """
    return RootResponse(
        message="Welcome to EDUNEXIS API - Smart India Hackathon 2026",
        docs_url="/docs",
        version=settings.VERSION,
    )


@app.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    tags=["Health"],
    summary="System Health Check",
)
async def health_check() -> HealthResponse:
    """
    Health check endpoint verifying that the backend service is running normally.
    """
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
    )


# Register API v1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Register translation router at /api prefix (supports direct POST /api/translate)
from app.api.routes.translate import router as translate_router
app.include_router(translate_router, prefix="/api")



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.BACKEND_PORT,
        reload=True,
    )
