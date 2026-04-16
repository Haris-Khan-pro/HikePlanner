from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserClerkSync(BaseModel):
    clerk_user_id: str
    email: str
    name: Optional[str] = None
    profile_image: Optional[str] = None
    auth_provider: str = "clerk"

class UserInDB(BaseModel):
    clerk_user_id: Optional[str] = None
    username: Optional[str] = None
    email: str
    hashed_password: Optional[str] = None
    name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    custom_username: Optional[str] = None
    profile_image: Optional[str] = None
    about: Optional[str] = None
    website: Optional[str] = None
    auth_provider: str = "email"
    saved_trails: List[str] = []
    completed_activities: int = 0
    total_distance_km: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

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

class UserUpdate(BaseModel):
    custom_username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    name: Optional[str] = None
    about: Optional[str] = None
    website: Optional[str] = None
    profile_image: Optional[str] = None