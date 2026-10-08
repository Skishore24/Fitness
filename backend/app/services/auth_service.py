"""
Auth & User Management Service
"""
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.goal import Goal


class AuthService:
    @staticmethod
    def get_or_create_user(db: Session, token_payload: Dict[str, Any]) -> User:
        """
        Derives the authenticated user from the verified Firebase UID.
        If user does not exist in PostgreSQL, automatically creates the user record and default goals.
        """
        firebase_uid = token_payload.get("uid")
        if not firebase_uid:
            raise ValueError("Firebase UID missing in token payload")

        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        if not user:
            user = User(
                firebase_uid=firebase_uid,
                email=token_payload.get("email") or f"{firebase_uid}@fittrack.local",
                name=token_payload.get("name") or "Athlete",
                profile_image=token_payload.get("picture"),
            )
            db.add(user)
            db.flush()

            # Initialize default goals for new user
            default_goal = Goal(
                user_id=user.id,
                daily_steps=10000,
                daily_calories=500,
                active_minutes=45,
                water=2500,
            )
            db.add(default_goal)
            db.commit()
            db.refresh(user)

        return user
