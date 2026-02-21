from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.models.user import UserCreate, UserInDB
from datetime import datetime
import hashlib

router = APIRouter(prefix="/api/users", tags=["Users"])

# Simple password hasher (for learning — use bcrypt in production!)
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/register")
async def register_user(user: UserCreate):
    # Check if email already exists
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Build the DB object
    user_in_db = UserInDB(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        created_at=datetime.utcnow()
    )

    # Save to MongoDB!
    result = await users_collection.insert_one(user_in_db.dict())

    return {
        "message": "User registered successfully!",
        "user_id": str(result.inserted_id)
    }

@router.get("/{user_id}")
async def get_user(user_id: str):
    from bson import ObjectId
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["id"] = str(user["_id"])
    del user["_id"]
    del user["hashed_password"]  # never return password!
    return user