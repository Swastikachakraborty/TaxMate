"""GigSaathi Backend — FastAPI Application Entry Point.

Cloud Run-ready: reads PORT and HOST from environment variables.
Mounts all routers under /api/v1/ prefix.
Manages MongoDB lifecycle via startup/shutdown events.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.db.database import mongodb
from app.limiter import limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle — connect/disconnect MongoDB."""
    # Startup
    await mongodb.connect()
    await mongodb.create_indexes()
    print(f"[OK] Connected to MongoDB ({settings.DB_NAME})")
    print(f"[AI] Using Gemini model: {settings.GEMINI_MODEL}")

    # Warn if the Gemini API key looks wrong
    key = settings.GEMINI_API_KEY
    if not key:
        print("[WARN] GEMINI_API_KEY is not set! AI chat will fail.")
    elif not key.startswith("AIza"):
        print(f"[WARN] GEMINI_API_KEY appears invalid (starts with '{key[:6]}...' instead of 'AIza...').")
        print("[WARN] Get a valid key from: https://aistudio.google.com/app/apikey")

    yield

    # Shutdown
    await mongodb.disconnect()
    print("[--] Disconnected from MongoDB")


app = FastAPI(
    title="GigSaathi API",
    description="Agentic AI-powered tax & compliance assistant for India's gig workers",
    version="1.0.0",
    lifespan=lifespan,
)

# Attach limiter to app state so route decorators can find it
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)

# CORS — allowed origins are loaded from the ALLOWED_ORIGINS env var
# (comma-separated list of exact origins, no wildcards).
# If unset, we fall back to safe localhost defaults for development.
# Example production value:
#   ALLOWED_ORIGINS=https://gigsaathi.run.app,https://app.gigsaathi.in
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "")
if _raw_origins.strip():
    _cors_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]
else:
    # Development fallback: localhost only
    _cors_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)


# ── Health check ────────────────────────────────────────────────────
@app.get("/", tags=["health"])
async def root():
    """Health check endpoint — confirms the API is running."""
    return {
        "status": "healthy",
        "service": "gigsaathi-backend",
        "version": "1.0.0",
        "model": settings.GEMINI_MODEL,
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Detailed health check with dependency status."""
    mongo_ok = mongodb.client is not None
    return {
        "status": "healthy" if mongo_ok else "degraded",
        "mongodb": "connected" if mongo_ok else "disconnected",
        "gemini_model": settings.GEMINI_MODEL,
        "environment": settings.ENV,
    }


# ── Register Routers ───────────────────────────────────────────────
from app.routes import upload, income, tax, chat, deadlines, users

app.include_router(upload.router, prefix="/api/v1", tags=["upload"])
app.include_router(income.router, prefix="/api/v1", tags=["income"])
app.include_router(tax.router, prefix="/api/v1", tags=["tax"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(deadlines.router, prefix="/api/v1", tags=["deadlines"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", settings.PORT))
    host = os.environ.get("HOST", settings.HOST)

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=settings.is_development,
    )
