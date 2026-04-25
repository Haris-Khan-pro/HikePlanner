# app/routes/recommendations.py
from fastapi import APIRouter, HTTPException, Query
from app.ml.recommendation_engine import get_recommended_trails, get_user_preferences
from app.ml.model_utils import format_recommendation_response, log_recommendation_event
from app.database import db

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

trails_collection = db["trails"]


async def fetch_all_trails() -> list[dict]:
    trails = []
    async for trail in trails_collection.find({}):
        trail["id"] = str(trail["_id"])
        del trail["_id"]
        trails.append(trail)
    return trails


@router.get("/{clerk_user_id}")
async def get_recommendations(
    clerk_user_id: str,
    top_n: int = Query(default=5, ge=1, le=20),
):
    if not clerk_user_id:
        raise HTTPException(status_code=400, detail="clerk_user_id is required")

    all_trails = await fetch_all_trails()
    if not all_trails:
        raise HTTPException(
            status_code=404,
            detail="No trails found. Please seed trails first."
        )

    # Get scraped posts for sentiment scoring
    scraped_posts = []
    scraped_collection = db["scraped_posts"]
    async for post in scraped_collection.find({}).limit(500):
        post.pop("_id", None)
        scraped_posts.append(post)

    # Get user preferences to include in response
    preferences = await get_user_preferences(clerk_user_id)

    recommended = await get_recommended_trails(
        clerk_user_id=clerk_user_id,
        all_trails=all_trails,
        scraped_posts=scraped_posts if scraped_posts else None,
        top_n=top_n,
    )

    formatted = format_recommendation_response(recommended)
    trail_ids  = [t.get("id", "") for t in formatted]
    log_recommendation_event(clerk_user_id, trail_ids)

    return {
        "user_id":         clerk_user_id,
        "total":           len(formatted),
        "is_personalized": preferences["total_hikes"] > 0,
        "total_hikes":     preferences["total_hikes"],
        "preferences":     preferences,
        "recommendations": formatted,
    }


@router.get("/trending/locations")
async def get_trending_locations():
    from app.ml.sentiment_analysis import aggregate_location_sentiment
    scraped_posts = []
    scraped_collection = db["scraped_posts"]
    async for post in scraped_collection.find({}).limit(1000):
        post.pop("_id", None)
        scraped_posts.append(post)

    if not scraped_posts:
        return {"trending": [], "message": "No scraped data yet. Run scraper first."}

    sentiment_map = aggregate_location_sentiment(scraped_posts)
    trending = [{"location": loc, **data} for loc, data in sentiment_map.items()]
    trending.sort(key=lambda x: (x["avg_rating"], x["post_count"]), reverse=True)
    return {"trending": trending[:10]}