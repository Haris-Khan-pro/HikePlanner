# backend-hike/app/models/user.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Received when registering via email/password ──────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


# ── Received when Clerk OAuth user logs in for first time ─────────────────────
class UserClerkSync(BaseModel):
    clerk_user_id: str
    email: str
    name: Optional[str] = None
    profile_image: Optional[str] = None
    auth_provider: str = "clerk"   # "clerk", "google", "apple"


# ── What's stored IN the database ─────────────────────────────────────────────
class UserInDB(BaseModel):
    clerk_user_id: Optional[str] = None
    username: Optional[str] = None
    email: str
    hashed_password: Optional[str] = None   # None for OAuth users
    name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    custom_username: Optional[str] = None
    profile_image: Optional[str] = None
    about: Optional[str] = None
    website: Optional[str] = None
    auth_provider: str = "email"
    saved_trails: List[str] = []            # list of trail IDs
    completed_activities: int = 0
    total_distance_km: float = 0.0
    created_at: datetime = datetime.utcnow()
    last_login: Optional[datetime] = None


# ── What we send back to the frontend ─────────────────────────────────────────
class UserResponse(BaseModel):
    id: str
    clerk_user_id: Optional[str] = None
    email: str
    name: Optional[str] = None
    username: Optional[str] = None
    custom_username: Optional[str] = None
    profile_image: Optional[str] = None
    about: Optional[str] = None
    website: Optional[str] = None
    auth_provider: str
    saved_trails: List[str] = []
    completed_activities: int = 0
    total_distance_km: float = 0.0
    created_at: datetime
    last_login: Optional[datetime] = None


# ── For updating user profile ──────────────────────────────────────────────────
class UserUpdate(BaseModel):
    custom_username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    name: Optional[str] = None
    about: Optional[str] = None
    website: Optional[str] = None
    profile_image: Optional[str] = None