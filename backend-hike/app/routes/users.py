# backend-hike/app/routes/users.py

from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from app.database import users_collection
from app.models.user import UserCreate, UserClerkSync, UserInDB, UserUpdate
from datetime import datetime

router = APIRouter(prefix="/api/users", tags=["Users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ── Register (email/password) ─────────────────────────────────────────────────
@router.post("/register")
async def register_user(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_in_db = UserInDB(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        auth_provider="email",
        created_at=datetime.utcnow()
    )
    result = await users_collection.insert_one(user_in_db.dict())
    return {"message": "User registered successfully!", "user_id": str(result.inserted_id)}


# ── Clerk OAuth sync (called after first login) ───────────────────────────────
@router.post("/sync")
async def sync_clerk_user(user: UserClerkSync):
    existing = await users_collection.find_one({"clerk_user_id": user.clerk_user_id})
    if existing:
        # Already synced — just update last_login
        await users_collection.update_one(
            {"clerk_user_id": user.clerk_user_id},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        existing["id"] = str(existing["_id"])
        del existing["_id"]
        return existing

    # First time — create the user document
    user_in_db = UserInDB(
        clerk_user_id=user.clerk_user_id,
        email=user.email,
        name=user.name,
        profile_image=user.profile_image,
        auth_provider=user.auth_provider,
        created_at=datetime.utcnow(),
        last_login=datetime.utcnow()
    )
    result = await users_collection.insert_one(user_in_db.dict())
    return {"message": "User synced!", "user_id": str(result.inserted_id)}


# ── Get user by Clerk ID ──────────────────────────────────────────────────────
@router.get("/{user_id}")
async def get_user(user_id: str):
    user = await users_collection.find_one({"clerk_user_id": user_id})
    if not user:
        return {
            "id": user_id,
            "clerk_user_id": user_id,
            "custom_username": None,
            "created_at": datetime.utcnow().isoformat(),
        }
    user["id"] = str(user["_id"])
    del user["_id"]
    return user


# ── Update user profile ───────────────────────────────────────────────────────
@router.put("/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate):
    update_data = {}
    if user_update.custom_username is not None:
        update_data["custom_username"] = user_update.custom_username.strip()
    if user_update.first_name is not None:
        update_data["first_name"] = user_update.first_name.strip()
    if user_update.last_name is not None:
        update_data["last_name"] = user_update.last_name.strip()
    if user_update.name is not None:
        update_data["name"] = user_update.name.strip()
    if user_update.about is not None:
        update_data["about"] = user_update.about.strip()
    if user_update.website is not None:
        update_data["website"] = user_update.website.strip()
    if user_update.profile_image is not None:
        update_data["profile_image"] = user_update.profile_image

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    await users_collection.update_one(
        {"clerk_user_id": user_id},
        {"$set": {**update_data, "clerk_user_id": user_id}},
        upsert=True
    )
    user = await users_collection.find_one({"clerk_user_id": user_id})
    user["id"] = str(user["_id"])
    del user["_id"]
    return user


# ── Save / unsave a trail ─────────────────────────────────────────────────────
@router.post("/{user_id}/saved-trails/{trail_id}")
async def save_trail(user_id: str, trail_id: str):
    await users_collection.update_one(
        {"clerk_user_id": user_id},
        {"$addToSet": {"saved_trails": trail_id}},
        upsert=True
    )
    return {"message": "Trail saved!"}


@router.delete("/{user_id}/saved-trails/{trail_id}")
async def unsave_trail(user_id: str, trail_id: str):
    await users_collection.update_one(
        {"clerk_user_id": user_id},
        {"$pull": {"saved_trails": trail_id}}
    )
    return {"message": "Trail removed from saved!"}