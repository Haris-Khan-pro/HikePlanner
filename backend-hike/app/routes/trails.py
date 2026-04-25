# app/routes/trails.py
from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import trails_collection
from app.models.trail import TrailCreate, TrailInDB, TrailUpdate
from app.auth import get_current_user
from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional

router = APIRouter(prefix="/api/trails", tags=["Trails"])


# ── PUBLIC: Get all trails (with optional filters) ────────────────────────────
@router.get("/")
async def get_trails(
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    popular: Optional[bool] = Query(None),
):
    query = {}
    if difficulty:
        query["difficulty"] = difficulty
    if featured is not None:
        query["isFeatured"] = featured
    if popular is not None:
        query["isPopular"] = popular
    if search:
        query["$or"] = [
            {"name":     {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"tags":     {"$regex": search, "$options": "i"}},
        ]

    trails = []
    async for trail in trails_collection.find(query):
        trail["id"] = str(trail["_id"])
        del trail["_id"]
        trails.append(trail)
    return trails


# ── PUBLIC: Get single trail ──────────────────────────────────────────────────
@router.get("/{trail_id}")
async def get_trail(trail_id: str):
    try:
        trail = await trails_collection.find_one({"_id": ObjectId(trail_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid trail ID")
    if not trail:
        raise HTTPException(status_code=404, detail="Trail not found")
    trail["id"] = str(trail["_id"])
    del trail["_id"]
    return trail


# ── PROTECTED: Create trail ───────────────────────────────────────────────────
@router.post("/")
async def create_trail(
    trail: TrailCreate,
    current_user: str = Depends(get_current_user),   # ← requires valid token
):
    trail_in_db = TrailInDB(**trail.dict(), created_at=datetime.now(timezone.utc))
    result = await trails_collection.insert_one(trail_in_db.dict())
    return {"message": "Trail created!", "trail_id": str(result.inserted_id)}


# ── PROTECTED: Update trail ───────────────────────────────────────────────────
@router.put("/{trail_id}")
async def update_trail(
    trail_id: str,
    trail_update: TrailUpdate,
    current_user: str = Depends(get_current_user),   # ← requires valid token
):
    update_data = {k: v for k, v in trail_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        result = await trails_collection.update_one(
            {"_id": ObjectId(trail_id)},
            {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid trail ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Trail not found")
    return {"message": "Trail updated!"}


# ── PROTECTED: Delete trail ───────────────────────────────────────────────────
@router.delete("/{trail_id}")
async def delete_trail(
    trail_id: str,
    current_user: str = Depends(get_current_user),   # ← requires valid token
):
    try:
        result = await trails_collection.delete_one({"_id": ObjectId(trail_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid trail ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Trail not found")
    return {"message": "Trail deleted!"}