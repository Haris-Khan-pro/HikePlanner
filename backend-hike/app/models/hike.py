# app/models/hike.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class HikeCreate(BaseModel):
    trail_name:        str
    trail_id:          Optional[str] = None    # link to trails collection
    location:          Optional[str] = None    # e.g. "Hunza Valley, Gilgit-Baltistan"
    distance_km:       float
    duration_minutes:  int
    difficulty:        str                     # "easy" | "moderate" | "hard"
    elevation_gain_m:  Optional[float] = None
    notes:             Optional[str] = None
    user_id:           str                     # clerk_user_id of the hiker


class HikeResponse(BaseModel):
    id:                str
    trail_name:        str
    trail_id:          Optional[str]
    location:          Optional[str]
    distance_km:       float
    duration_minutes:  int
    difficulty:        str
    elevation_gain_m:  Optional[float]
    notes:             Optional[str]
    user_id:           str
    created_at:        datetime


class HikeInDB(BaseModel):
    trail_name:        str
    trail_id:          Optional[str] = None
    location:          Optional[str] = None
    distance_km:       float
    duration_minutes:  int
    difficulty:        str
    elevation_gain_m:  Optional[float] = None
    notes:             Optional[str] = None
    user_id:           str
    created_at:        datetime = datetime.utcnow()