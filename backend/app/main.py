"""
FitTrack FastAPI Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
import app.models.user
import app.models.activity
import app.models.workout
import app.models.goal

from app.routers import auth, users, activities, workouts, goals

# Initialize database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-quality personal fitness API for FitTrack Android App",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for local network and mobile devices
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(users.router, prefix=settings.API_PREFIX)
app.include_router(activities.router, prefix=settings.API_PREFIX)
app.include_router(workouts.router, prefix=settings.API_PREFIX)
app.include_router(goals.router, prefix=settings.API_PREFIX)


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint used by mobile app to verify network connectivity."""
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected",
    }


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to FitTrack API",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
