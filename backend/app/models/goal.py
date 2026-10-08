"""
Goal Database Model
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    daily_steps = Column(Integer, default=10000, nullable=False)
    daily_calories = Column(Integer, default=500, nullable=False)
    active_minutes = Column(Integer, default=45, nullable=False)
    water = Column(Integer, default=2500, nullable=False)  # ml
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="goal")
