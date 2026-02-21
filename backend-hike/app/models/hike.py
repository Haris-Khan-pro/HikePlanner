# backend-hike/app/models/hike.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# What data we receive when logging a hike
class HikeCreate(BaseModel):
    trail_name: str
    distance_km: float
    duration_minutes: int
    difficulty: str          # "easy", "medium", "hard"
    elevation_gain_m: Optional[float] = None
    notes: Optional[str] = None
    user_id: str             # who did this hike

# What we send back
class HikeResponse(BaseModel):
    id: str
    trail_name: str
    distance_km: float
    duration_minutes: int
    difficulty: str
    elevation_gain_m: Optional[float]
    notes: Optional[str]
    user_id: str
    created_at: datetime

# What's stored in DB
class HikeInDB(BaseModel):
    trail_name: str
    distance_km: float
    duration_minutes: int
    difficulty: str
    elevation_gain_m: Optional[float] = None
    notes: Optional[str] = None
    user_id: str
    created_at: datetime = datetime.utcnow()