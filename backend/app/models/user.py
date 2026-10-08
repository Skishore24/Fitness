"""
User Database Model
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    firebase_uid = Column(String(128), unique=True, index=True, nullable=False)
    google_id = Column(String(128), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True)
    profile_image = Column(String(1024), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(32), nullable=True)
    height = Column(Float, nullable=True)  # cm
    weight = Column(Float, nullable=True)  # kg
    fitness_goal = Column(String(64), nullable=True)
    activity_level = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    activities = relationship("DailyActivity", back_populates="user", cascade="all, delete-orphan")
    workouts = relationship("Workout", back_populates="user", cascade="all, delete-orphan")
    goal = relationship("Goal", back_populates="user", uselist=False, cascade="all, delete-orphan")
