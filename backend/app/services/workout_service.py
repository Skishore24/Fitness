"""
Workout Service
"""
import uuid
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.workout import Workout
from app.schemas.workout import WorkoutCreate


class WorkoutService:
    @staticmethod
    def create_workout(db: Session, user_id: str, data: WorkoutCreate) -> Workout:
        def parse_dt(val: str) -> datetime:
            try:
                return datetime.fromisoformat(val.replace("Z", "+00:00"))
            except Exception:
                return datetime.now(timezone.utc)

        workout = Workout(
            id=data.id or str(uuid.uuid4()),
            user_id=user_id,
            type=data.type,
            start_time=parse_dt(data.startTime),
            end_time=parse_dt(data.endTime),
            duration_seconds=data.durationSeconds,
            distance=data.distance,
            calories=data.calories,
        )
        db.add(workout)
        db.commit()
        db.refresh(workout)
        return workout

    @staticmethod
    def get_workouts(db: Session, user_id: str) -> List[Workout]:
        return (
            db.query(Workout)
            .filter(Workout.user_id == user_id)
            .order_by(Workout.created_at.desc())
            .all()
        )

    @staticmethod
    def get_workout_by_id(db: Session, user_id: str, workout_id: str) -> Optional[Workout]:
        return (
            db.query(Workout)
            .filter(Workout.user_id == user_id, Workout.id == workout_id)
            .first()
        )

    @staticmethod
    def delete_workout(db: Session, user_id: str, workout_id: str) -> bool:
        workout = (
            db.query(Workout)
            .filter(Workout.user_id == user_id, Workout.id == workout_id)
            .first()
        )
        if workout:
            db.delete(workout)
            db.commit()
            return True
        return False
