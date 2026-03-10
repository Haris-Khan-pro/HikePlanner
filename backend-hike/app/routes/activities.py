# backend-hike/app/routes/activities.py

from fastapi import APIRouter, HTTPException
from app.database import activities_collection, users_collection
from app.models.activity import ActivityCreate, ActivityInDB, ActivityStats
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/activities", tags=["Activities"])


# ── Save a new recorded activity ─────────────────────────────────────────────
@router.post("/")
async def create_activity(activity: ActivityCreate):
    activity_in_db = ActivityInDB(**activity.dict(), created_at=datetime.utcnow())

    # Convert GpsPoint objects to dicts for MongoDB
    data = activity_in_db.dict()
    data["path"] = [p.dict() for p in activity_in_db.path]

    result = await activities_collection.insert_one(data)

    # Update user stats
    distance_km = round(activity.distance / 1000, 2)
    await users_collection.update_one(
        {"clerk_user_id": activity.clerk_user_id},
        {
            "$inc": {
                "completed_activities": 1,
                "total_distance_km": distance_km
            }
        },
        upsert=True
    )

    return {"message": "Activity saved!", "activity_id": str(result.inserted_id)}


# ── Get all activities for a user ─────────────────────────────────────────────
@router.get("/")
async def get_activities(clerk_user_id: str):
    activities = []
    async for act in activities_collection.find(
        {"clerk_user_id": clerk_user_id}
    ).sort("created_at", -1):
        act["id"] = str(act["_id"])
        del act["_id"]
        activities.append(act)
    return activities


# ── Get activity stats summary for a user ────────────────────────────────────
@router.get("/stats")
async def get_activity_stats(clerk_user_id: str) -> ActivityStats:
    total = 0
    total_distance = 0.0
    total_duration = 0
    total_calories = 0
    total_elevation = 0.0

    async for act in activities_collection.find({"clerk_user_id": clerk_user_id}):
        total += 1
        total_distance += act.get("distance", 0)
        total_duration += act.get("duration", 0)
        total_calories += act.get("calories", 0)
        total_elevation += act.get("elevation_gain", 0)

    return ActivityStats(
        total_activities=total,
        total_distance_km=round(total_distance / 1000, 2),
        total_duration_hours=round(total_duration / 3600, 2),
        total_calories=total_calories,
        total_elevation_m=round(total_elevation, 2)
    )


# ── Get single activity ───────────────────────────────────────────────────────
@router.get("/{activity_id}")
async def get_activity(activity_id: str):
    try:
        act = await activities_collection.find_one({"_id": ObjectId(activity_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid activity ID")
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    act["id"] = str(act["_id"])
    del act["_id"]
    return act


# ── Delete activity ───────────────────────────────────────────────────────────
@router.delete("/{activity_id}")
async def delete_activity(activity_id: str):
    try:
        act = await activities_collection.find_one({"_id": ObjectId(activity_id)})
        if not act:
            raise HTTPException(status_code=404, detail="Activity not found")

        result = await activities_collection.delete_one({"_id": ObjectId(activity_id)})

        # Decrement user stats
        distance_km = round(act.get("distance", 0) / 1000, 2)
        await users_collection.update_one(
            {"clerk_user_id": act["clerk_user_id"]},
            {
                "$inc": {
                    "completed_activities": -1,
                    "total_distance_km": -distance_km
                }
            }
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid activity ID")

    return {"message": "Activity deleted!"}