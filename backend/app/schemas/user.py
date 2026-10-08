"""
User Pydantic Schemas
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    profile_image: Optional[str] = Field(None, alias="profileImage")
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitness_goal: Optional[str] = Field(None, alias="fitnessGoal")
    activity_level: Optional[str] = Field(None, alias="activityLevel")

    model_config = ConfigDict(populate_by_name=True)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitness_goal: Optional[str] = Field(None, alias="fitnessGoal")
    activity_level: Optional[str] = Field(None, alias="activityLevel")
    profile_image: Optional[str] = Field(None, alias="profileImage")

    model_config = ConfigDict(populate_by_name=True)


class UserResponse(UserBase):
    id: str
    firebase_uid: str
    google_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    firebaseUid: Optional[str] = None
    googleId: Optional[str] = None
    fitnessGoal: Optional[str] = None
    activityLevel: Optional[str] = None
    profileImage: Optional[str] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    def model_post_init(self, __context):
        if self.firebaseUid is None:
            self.firebaseUid = self.firebase_uid
        if self.googleId is None:
            self.googleId = self.google_id
        if self.fitnessGoal is None:
            self.fitnessGoal = self.fitness_goal
        if self.activityLevel is None:
            self.activityLevel = self.activity_level
        if self.profileImage is None:
            self.profileImage = self.profile_image

