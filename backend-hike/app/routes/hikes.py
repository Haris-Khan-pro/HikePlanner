# backend-hike/app/routes/hikes.py

from fastapi import APIRouter, HTTPException
from app.database import hikes_collection
from app.models.hike import HikeCreate, HikeInDB
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/hikes", tags=["Hikes"])

@router.post("/")
async def log_hike(hike: HikeCreate):
    hike_in_db = HikeInDB(
        **hike.dict(),
        created_at=datetime.utcnow()
    )
    result = await hikes_collection.insert_one(hike_in_db.dict())
    return {
        "message": "Hike logged successfully!",
        "hike_id": str(result.inserted_id)
    }

@router.get("/user/{user_id}")
async def get_user_hikes(user_id: str):
    hikes = []
    async for hike in hikes_collection.find({"user_id": user_id}):
        hike["id"] = str(hike["_id"])
        del hike["_id"]
        hikes.append(hike)
    return {"hikes": hikes, "total": len(hikes)}

@router.get("/{hike_id}")
async def get_hike(hike_id: str):
    hike = await hikes_collection.find_one({"_id": ObjectId(hike_id)})
    if not hike:
        raise HTTPException(status_code=404, detail="Hike not found")
    hike["id"] = str(hike["_id"])
    del hike["_id"]
    return hike

@router.delete("/{hike_id}")
async def delete_hike(hike_id: str):
    result = await hikes_collection.delete_one({"_id": ObjectId(hike_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hike not found")
    return {"message": "Hike deleted!"}