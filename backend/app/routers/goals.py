"""
Goals Router
GET /goals
PUT /goals
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_token
from app.services.auth_service import AuthService
from app.models.goal import Goal
from app.schemas.goal import GoalResponse, GoalUpdate

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("", response_model=GoalResponse)
def get_user_goals(
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Retrieve personal daily targets."""
    user = AuthService.get_or_create_user(db, token_payload)
    if not user.goal:
        new_goal = Goal(
            user_id=user.id,
            daily_steps=10000,
            daily_calories=500,
            active_minutes=45,
            water=2500,
        )
        db.add(new_goal)
        db.commit()
        db.refresh(new_goal)
        return new_goal
    return user.goal


@router.put("", response_model=GoalResponse)
def update_user_goals(
    data: GoalUpdate,
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Update personal daily targets."""
    user = AuthService.get_or_create_user(db, token_payload)
    goal = user.goal

    if not goal:
        goal = Goal(user_id=user.id)
        db.add(goal)

    for field, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(goal, field, value)

    db.commit()
    db.refresh(goal)
    return goal
