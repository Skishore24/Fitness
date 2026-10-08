"""
Daily Activity Database Model
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class DailyActivity(Base):
    __tablename__ = "daily_activity"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String(10), nullable=False, index=True)  # YYYY-MM-DD
    steps = Column(Integer, default=0, nullable=False)
    distance = Column(Float, default=0.0, nullable=False)  # km
    calories = Column(Integer, default=0, nullable=False)  # kcal
    active_minutes = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Unique constraint per user per date to prevent duplicates
    __table_args__ = (
        UniqueConstraint("user_id", "date", name="uix_user_date"),
    )

    user = relationship("User", back_populates="activities")
