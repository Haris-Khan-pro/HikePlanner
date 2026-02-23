# backend-hike/app/models/user.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserSyncRequest(BaseModel):
    # This is the data we receive FROM the frontend
    clerk_id: str          # Clerk's unique ID for this user
    email: str
    name: Optional[str] = None
    profile_image: Optional[str] = None
    auth_provider: str     # "email" or "google" or "apple"

class UserResponse(BaseModel):
    clerk_id: str
    email: str
    name: Optional[str]
    profile_image: Optional[str]
    auth_provider: str
    created_at: datetime
    is_new_user: bool      # tells frontend if this was first time signup