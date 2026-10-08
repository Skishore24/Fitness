"""
Users Router
GET /users/me
PUT /users/me
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_token
from app.services.auth_service import AuthService
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_my_profile(
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Retrieve profile of currently authenticated user."""
    user = AuthService.get_or_create_user(db, token_payload)
    return user


@router.put("/me", response_model=UserResponse)
def update_my_profile(
    profile_data: UserUpdate,
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Update bio details and fitness preferences."""
    user = AuthService.get_or_create_user(db, token_payload)

    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user
