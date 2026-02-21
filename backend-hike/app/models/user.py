from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# What data we RECEIVE when creating a user
class UserCreate(BaseModel):
    username: str
    email: str
    password: str  # we'll hash this later

# What data we SEND BACK (never send password back!)
class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime

# What's stored IN the database
class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str
    created_at: datetime = datetime.utcnow()