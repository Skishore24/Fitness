"""
Workout Pydantic Schemas
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class WorkoutCreate(BaseModel):
    id: Optional[str] = None
    type: str
    startTime: str = Field(..., alias="start_time")
    endTime: str = Field(..., alias="end_time")
    durationSeconds: int = Field(..., alias="duration_seconds", ge=0)
    distance: Optional[float] = None
    calories: int = Field(default=0, ge=0)

    model_config = ConfigDict(populate_by_name=True)


class WorkoutResponse(BaseModel):
    id: str
    user_id: str
    type: str
    start_time: datetime
    end_time: datetime
    duration_seconds: int
    distance: Optional[float] = None
    calories: int
    created_at: datetime

    startTime: Optional[str] = None
    endTime: Optional[str] = None
    durationSeconds: Optional[int] = None
    createdAt: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    def model_post_init(self, __context):
        if self.startTime is None:
            self.startTime = self.start_time.isoformat()
        if self.endTime is None:
            self.endTime = self.end_time.isoformat()
        if self.durationSeconds is None:
            self.durationSeconds = self.duration_seconds
        if self.createdAt is None:
            self.createdAt = self.created_at.isoformat()

