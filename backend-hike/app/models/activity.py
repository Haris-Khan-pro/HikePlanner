# backend-hike/app/models/activity.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── GPS coordinate point ───────────────────────────────────────────────────────
class GpsPoint(BaseModel):
    latitude: float
    longitude: float


# ── Received when saving a recorded activity ──────────────────────────────────
class ActivityCreate(BaseModel):
    clerk_user_id: str
    trail_id: Optional[str] = None           # optional — user might hike off-trail
    trail_name: Optional[str] = None
    start_time: str                          # ISO datetime string
    end_time: str                            # ISO datetime string
    distance: float                          # meters
    duration: int                            # seconds
    elevation_gain: float                    # meters
    avg_speed: float                         # m/s
    max_speed: float                         # m/s
    calories: int
    path: List[GpsPoint] = []               # full GPS path recorded


# ── What's stored IN the database ─────────────────────────────────────────────
class ActivityInDB(BaseModel):
    clerk_user_id: str
    trail_id: Optional[str] = None
    trail_name: Optional[str] = None
    start_time: str
    end_time: str
    distance: float
    duration: int
    elevation_gain: float
    avg_speed: float
    max_speed: float
    calories: int
    path: List[GpsPoint] = []
    created_at: datetime = datetime.utcnow()


# ── What we send back to the frontend ─────────────────────────────────────────
class ActivityResponse(BaseModel):
    id: str
    clerk_user_id: str
    trail_id: Optional[str] = None
    trail_name: Optional[str] = None
    start_time: str
    end_time: str
    distance: float
    duration: int
    elevation_gain: float
    avg_speed: float
    max_speed: float
    calories: int
    path: List[GpsPoint] = []
    created_at: datetime


# ── Summary stats (used in profile screen) ────────────────────────────────────
class ActivityStats(BaseModel):
    total_activities: int
    total_distance_km: float
    total_duration_hours: float
    total_calories: int
    total_elevation_m: float