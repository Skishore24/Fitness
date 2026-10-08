"""
Workouts Router
GET /workouts
POST /workouts
GET /workouts/{id}
DELETE /workouts/{id}
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_token
from app.services.auth_service import AuthService
from app.services.workout_service import WorkoutService
from app.schemas.workout import WorkoutCreate, WorkoutResponse

router = APIRouter(prefix="/workouts", tags=["Workouts"])


@router.get("", response_model=List[WorkoutResponse])
def get_workouts(
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Retrieve all workout sessions for the authenticated user."""
    user = AuthService.get_or_create_user(db, token_payload)
    return WorkoutService.get_workouts(db, user.id)


@router.post("", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
def create_workout(
    data: WorkoutCreate,
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Save completed workout session."""
    user = AuthService.get_or_create_user(db, token_payload)
    return WorkoutService.create_workout(db, user.id, data)


@router.get("/{workout_id}", response_model=WorkoutResponse)
def get_workout_by_id(
    workout_id: str,
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Retrieve specific workout details."""
    user = AuthService.get_or_create_user(db, token_payload)
    workout = WorkoutService.get_workout_by_id(db, user.id, workout_id)
    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout session not found",
        )
    return workout


@router.delete("/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workout(
    workout_id: str,
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Delete a workout session."""
    user = AuthService.get_or_create_user(db, token_payload)
    success = WorkoutService.delete_workout(db, user.id, workout_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found",
        )
    return None
