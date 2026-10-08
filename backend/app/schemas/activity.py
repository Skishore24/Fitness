"""
Activity Pydantic Schemas
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ActivitySyncRequest(BaseModel):
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    steps: int = Field(default=0, ge=0)
    distance: float = Field(default=0.0, ge=0.0)
    calories: int = Field(default=0, ge=0)
    active_minutes: int = Field(default=0, ge=0, alias="activeMinutes")

    model_config = ConfigDict(populate_by_name=True)


class ActivityResponse(BaseModel):
    id: str
    user_id: str
    date: str
    steps: int
    distance: float
    calories: int
    active_minutes: int
    activeMinutes: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    def model_post_init(self, __context):
        if self.activeMinutes is None:
            self.activeMinutes = self.active_minutes

