# backend-hike/app/routes/reviews.py

from fastapi import APIRouter, HTTPException
from app.database import reviews_collection, trails_collection
from app.models.review import ReviewCreate, ReviewInDB, ReviewUpdate
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


# ── Submit a review ───────────────────────────────────────────────────────────
@router.post("/")
async def create_review(review: ReviewCreate):
    # Prevent duplicate review from same user on same trail
    existing = await reviews_collection.find_one({
        "trail_id": review.trail_id,
        "clerk_user_id": review.clerk_user_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this trail")

    review_in_db = ReviewInDB(**review.dict(), created_at=datetime.utcnow())
    result = await reviews_collection.insert_one(review_in_db.dict())

    # Recalculate trail average rating
    await _update_trail_rating(review.trail_id)

    return {"message": "Review submitted!", "review_id": str(result.inserted_id)}


# ── Get all reviews for a trail ───────────────────────────────────────────────
@router.get("/trail/{trail_id}")
async def get_trail_reviews(trail_id: str):
    reviews = []
    async for review in reviews_collection.find(
        {"trail_id": trail_id}
    ).sort("created_at", -1):
        review["id"] = str(review["_id"])
        del review["_id"]
        reviews.append(review)
    return {"reviews": reviews, "total": len(reviews)}


# ── Get all reviews by a user ─────────────────────────────────────────────────
@router.get("/user/{clerk_user_id}")
async def get_user_reviews(clerk_user_id: str):
    reviews = []
    async for review in reviews_collection.find(
        {"clerk_user_id": clerk_user_id}
    ).sort("created_at", -1):
        review["id"] = str(review["_id"])
        del review["_id"]
        reviews.append(review)
    return {"reviews": reviews, "total": len(reviews)}


# ── Update a review ───────────────────────────────────────────────────────────
@router.put("/{review_id}")
async def update_review(review_id: str, review_update: ReviewUpdate):
    update_data = {k: v for k, v in review_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        review = await reviews_collection.find_one({"_id": ObjectId(review_id)})
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")

        await reviews_collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": update_data}
        )
        await _update_trail_rating(review["trail_id"])
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid review ID")

    return {"message": "Review updated!"}


# ── Delete a review ───────────────────────────────────────────────────────────
@router.delete("/{review_id}")
async def delete_review(review_id: str):
    try:
        review = await reviews_collection.find_one({"_id": ObjectId(review_id)})
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")

        await reviews_collection.delete_one({"_id": ObjectId(review_id)})
        await _update_trail_rating(review["trail_id"])
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid review ID")

    return {"message": "Review deleted!"}


# ── Helper: recalculate and update trail rating ───────────────────────────────
async def _update_trail_rating(trail_id: str):
    ratings = []
    async for r in reviews_collection.find({"trail_id": trail_id}):
        ratings.append(r["rating"])

    avg = round(sum(ratings) / len(ratings), 1) if ratings else 0.0
    count = len(ratings)

    try:
        await trails_collection.update_one(
            {"_id": ObjectId(trail_id)},
            {"$set": {"rating": avg, "review_count": count}}
        )
    except Exception:
        pass  # trail_id may not be a valid ObjectId in some cases