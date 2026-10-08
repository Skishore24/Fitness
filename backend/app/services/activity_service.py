"""
Activity Service
Handles daily activity synchronization, duplicate prevention, and historical aggregations.
"""
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.activity import DailyActivity
from app.schemas.activity import ActivitySyncRequest


class ActivityService:
    @staticmethod
    def sync_daily_activity(
        db: Session, user_id: str, payload: ActivitySyncRequest
    ) -> DailyActivity:
        """
        Upserts daily activity summary for a user and date.
        Guarantees duplicate prevention.
        """
        existing = (
            db.query(DailyActivity)
            .filter(
                DailyActivity.user_id == user_id,
                DailyActivity.date == payload.date,
            )
            .first()
        )

        if existing:
            existing.steps = payload.steps
            existing.distance = payload.distance
            existing.calories = payload.calories
            existing.active_minutes = payload.active_minutes
            existing.updated_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(existing)
            return existing

        activity = DailyActivity(
            user_id=user_id,
            date=payload.date,
            steps=payload.steps,
            distance=payload.distance,
            calories=payload.calories,
            active_minutes=payload.active_minutes,
        )
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity

    @staticmethod
    def get_today_activity(db: Session, user_id: str) -> Optional[DailyActivity]:
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        return (
            db.query(DailyActivity)
            .filter(DailyActivity.user_id == user_id, DailyActivity.date == today_str)
            .first()
        )

    @staticmethod
    def get_activity_history(
        db: Session, user_id: str, limit: int = 30
    ) -> List[DailyActivity]:
        return (
            db.query(DailyActivity)
            .filter(DailyActivity.user_id == user_id)
            .order_by(DailyActivity.date.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_weekly_activity(db: Session, user_id: str) -> List[DailyActivity]:
        return (
            db.query(DailyActivity)
            .filter(DailyActivity.user_id == user_id)
            .order_by(DailyActivity.date.desc())
            .limit(7)
            .all()
        )

    @staticmethod
    def get_monthly_activity(db: Session, user_id: str) -> List[DailyActivity]:
        return (
            db.query(DailyActivity)
            .filter(DailyActivity.user_id == user_id)
            .order_by(DailyActivity.date.desc())
            .limit(30)
            .all()
        )
