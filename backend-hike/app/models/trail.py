# backend-hike/app/models/trail.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Received when creating a trail (admin / seed) ─────────────────────────────
class TrailCreate(BaseModel):
    name: str
    location: str
    description: str
    distance: float                          # kilometers
    duration: int                            # minutes (estimated)
    difficulty: str                          # "Easy" | "Moderate" | "Hard" | "Expert"
    elevation: float                         # meters gain
    latitude: float
    longitude: float
    image: Optional[str] = None
    tags: List[str] = []
    isFeatured: bool = False
    isPopular: bool = False


# ── What's stored IN the database ─────────────────────────────────────────────
class TrailInDB(BaseModel):
    name: str
    location: str
    description: str
    distance: float
    duration: int
    difficulty: str
    elevation: float
    latitude: float
    longitude: float
    image: Optional[str] = None
    tags: List[str] = []
    isFeatured: bool = False
    isPopular: bool = False
    rating: float = 0.0                      # computed from reviews
    review_count: int = 0                    # total number of reviews
    created_at: datetime = datetime.utcnow()


# ── What we send back to the frontend ─────────────────────────────────────────
class TrailResponse(BaseModel):
    id: str
    name: str
    location: str
    description: str
    distance: float
    duration: int
    difficulty: str
    elevation: float
    latitude: float
    longitude: float
    image: Optional[str] = None
    tags: List[str] = []
    isFeatured: bool
    isPopular: bool
    rating: float
    review_count: int
    created_at: datetime


# ── For updating a trail ───────────────────────────────────────────────────────
class TrailUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    distance: Optional[float] = None
    duration: Optional[int] = None
    difficulty: Optional[str] = None
    elevation: Optional[float] = None
    image: Optional[str] = None
    tags: Optional[List[str]] = None
    isFeatured: Optional[bool] = None
    isPopular: Optional[bool] = None