# backend-hike/app/models/review.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ── Received when submitting a review ─────────────────────────────────────────
class ReviewCreate(BaseModel):
    trail_id: str
    clerk_user_id: str
    rating: float = Field(..., ge=1.0, le=5.0)   # 1.0 – 5.0 stars
    comment: Optional[str] = None
    username: Optional[str] = None               # display name shown on review


# ── What's stored IN the database ─────────────────────────────────────────────
class ReviewInDB(BaseModel):
    trail_id: str
    clerk_user_id: str
    rating: float
    comment: Optional[str] = None
    username: Optional[str] = None
    created_at: datetime = datetime.utcnow()


# ── What we send back to the frontend ─────────────────────────────────────────
class ReviewResponse(BaseModel):
    id: str
    trail_id: str
    clerk_user_id: str
    rating: float
    comment: Optional[str] = None
    username: Optional[str] = None
    created_at: datetime


# ── For updating a review ──────────────────────────────────────────────────────
class ReviewUpdate(BaseModel):
    rating: Optional[float] = Field(None, ge=1.0, le=5.0)
    comment: Optional[str] = None