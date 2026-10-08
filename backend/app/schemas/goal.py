"""
Goal Pydantic Schemas
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class GoalUpdate(BaseModel):
    daily_steps: Optional[int] = Field(None, alias="dailySteps", ge=0)
    daily_calories: Optional[int] = Field(None, alias="dailyCalories", ge=0)
    active_minutes: Optional[int] = Field(None, alias="activeMinutes", ge=0)
    water: Optional[int] = Field(None, ge=0)

    model_config = ConfigDict(populate_by_name=True)


class GoalResponse(BaseModel):
    id: str
    user_id: str
    daily_steps: int
    daily_calories: int
    active_minutes: int
    water: int
    created_at: datetime
    updated_at: datetime

    dailySteps: Optional[int] = None
    dailyCalories: Optional[int] = None
    activeMinutes: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

    def model_post_init(self, __context):
        if self.dailySteps is None:
            self.dailySteps = self.daily_steps
        if self.dailyCalories is None:
            self.dailyCalories = self.daily_calories
        if self.activeMinutes is None:
            self.activeMinutes = self.active_minutes

