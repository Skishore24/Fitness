"""
Auth Router
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_token
from app.services.auth_service import AuthService
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/verify", response_model=UserResponse)
def verify_token(
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Verifies Firebase token and returns user profile."""
    user = AuthService.get_or_create_user(db, token_payload)
    return user
