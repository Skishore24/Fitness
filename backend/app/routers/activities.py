"""
Activities Router
GET /activity/today
GET /activity/history
GET /activity/weekly
GET /activity/monthly
POST /activity/sync
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_token
from app.services.auth_service import AuthService
from app.services.activity_service import ActivityService
from app.schemas.activity import ActivityResponse, ActivitySyncRequest

router = APIRouter(prefix="/activity", tags=["Daily Activity"])


@router.post("/sync", response_model=ActivityResponse)
def sync_daily_activity(
    payload: ActivitySyncRequest,
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """
    Synchronizes daily aggregated activity summary from Android Health Connect.
    Prevents duplicate entries via unique constraint upsert.
    """
    user = AuthService.get_or_create_user(db, token_payload)
    return ActivityService.sync_daily_activity(db, user.id, payload)


@router.get("/today", response_model=Optional[ActivityResponse])
def get_today_activity(
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Retrieve today's synced activity summary."""
    user = AuthService.get_or_create_user(db, token_payload)
    activity = ActivityService.get_today_activity(db, user.id)
    return activity


@router.get("/weekly", response_model=List[ActivityResponse])
def get_weekly_activity(
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Retrieve activity for past 7 days."""
    user = AuthService.get_or_create_user(db, token_payload)
    return ActivityService.get_weekly_activity(db, user.id)


@router.get("/monthly", response_model=List[ActivityResponse])
def get_monthly_activity(
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Retrieve activity for past 30 days."""
    user = AuthService.get_or_create_user(db, token_payload)
    return ActivityService.get_monthly_activity(db, user.id)


@router.get("/history", response_model=List[ActivityResponse])
def get_activity_history(
    limit: int = Query(default=30, le=100),
    token_payload: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db),
):
    """Retrieve historical daily activity summaries."""
    user = AuthService.get_or_create_user(db, token_payload)
    return ActivityService.get_activity_history(db, user.id, limit=limit)
