# backend-hike/app/routes/users.py

from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.models.user import UserSyncRequest
from datetime import datetime

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("/sync")
async def sync_user(user: UserSyncRequest):
    """
    This endpoint is called every time a user signs up OR logs in.
    - If user is NEW → save them to MongoDB
    - If user EXISTS → just return their data (don't duplicate)
    """

    # Check if this user already exists using their Clerk ID
    existing_user = await users_collection.find_one({"clerk_id": user.clerk_id})

    if existing_user:
        # User already in DB → just return their info
        existing_user["id"] = str(existing_user["_id"])
        del existing_user["_id"]
        existing_user["is_new_user"] = False
        return existing_user
    
    # User is NEW → save to MongoDB
    new_user = {
        "clerk_id": user.clerk_id,
        "email": user.email,
        "name": user.name or "",
        "profile_image": user.profile_image or "",
        "auth_provider": user.auth_provider,  # "email", "google", or "apple"
        "created_at": datetime.utcnow(),
    }

    result = await users_collection.insert_one(new_user)

    return {
        "id": str(result.inserted_id),
        "clerk_id": user.clerk_id,
        "email": user.email,
        "name": user.name,
        "auth_provider": user.auth_provider,
        "is_new_user": True,
        "message": "User saved to MongoDB successfully!"
    }


@router.get("/{clerk_id}")
async def get_user(clerk_id: str):
    """Get a user's data from MongoDB using their Clerk ID"""
    user = await users_collection.find_one({"clerk_id": clerk_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["id"] = str(user["_id"])
    del user["_id"]
    return user