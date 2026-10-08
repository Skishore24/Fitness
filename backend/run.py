"""
FitTrack Backend Runner Script
Allows running with: python run.py
"""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"Starting FitTrack Backend on http://{settings.HOST}:{settings.PORT} ...")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
