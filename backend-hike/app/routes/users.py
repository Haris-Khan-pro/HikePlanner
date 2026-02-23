from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.models.user import UserCreate, UserInDB, UserUpdate
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
    # user_id is the Clerk user ID (e.g., user_36U3eWk4DflmstpBMw5a0Tqbk0O)
    user = await users_collection.find_one({"clerk_user_id": user_id})
    if not user:
        # User doesn't exist yet, return empty profile
        return {
            "id": user_id,
            "clerk_user_id": user_id,
            "custom_username": None,
            "created_at": datetime.utcnow().isoformat(),
        }
    
    user["id"] = str(user.get("_id", user_id))
    if "_id" in user:
        del user["_id"]
    return user

@router.put("/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate):
    # user_id is the Clerk user ID
    
    # Build update object with only provided fields
    update_data = {}
    if user_update.custom_username is not None:
        update_data["custom_username"] = user_update.custom_username.strip()
    if user_update.first_name is not None:
        update_data["first_name"] = user_update.first_name.strip()
    if user_update.last_name is not None:
        update_data["last_name"] = user_update.last_name.strip()
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Update or create the user document
    result = await users_collection.update_one(
        {"clerk_user_id": user_id},
        {"$set": {**update_data, "clerk_user_id": user_id}},
        upsert=True  # Create if doesn't exist
    )
    
    # Return updated user
    user = await users_collection.find_one({"clerk_user_id": user_id})
    user["id"] = str(user.get("_id", user_id))
    if "_id" in user:
        del user["_id"]
    return user