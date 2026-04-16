# backend-hike/app/routes/recommendations.py
# API endpoints for personalized trail recommendations

from fastapi import APIRouter, HTTPException, Query
from app.ml.recommendation_engine import get_recommended_trails
from app.ml.model_utils import format_recommendation_response, log_recommendation_event
from app.database import db

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

# We'll pull trails from the trails collection in DB
trails_collection = db["trails"]


async def fetch_all_trails() -> list[dict]:
    """Helper to fetch all trails from DB."""
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
    """
    Returns personalized trail recommendations for a user.

    - Pulls user's past hikes to understand preferences
    - Scores all trails based on difficulty, distance, sentiment, and rating
    - Returns top N recommendations

    Query params:
        top_n: How many recommendations to return (default 5, max 20)
    """
    if not clerk_user_id:
        raise HTTPException(status_code=400, detail="clerk_user_id is required")

    # Get all trails from DB
    all_trails = await fetch_all_trails()

    if not all_trails:
        raise HTTPException(
            status_code=404,
            detail="No trails found in database. Please seed trails first."
        )

    # Get scraped posts from DB (if any)
    scraped_posts = []
    scraped_collection = db["scraped_posts"]
    async for post in scraped_collection.find({}).limit(500):
        post.pop("_id", None)
        scraped_posts.append(post)

    # Generate recommendations
    recommended = await get_recommended_trails(
        clerk_user_id=clerk_user_id,
        all_trails=all_trails,
        scraped_posts=scraped_posts if scraped_posts else None,
        top_n=top_n,
    )

    # Format for response
    formatted = format_recommendation_response(recommended)

    # Log the event
    trail_ids = [t.get("id", "") for t in formatted]
    log_recommendation_event(clerk_user_id, trail_ids)

    return {
        "user_id": clerk_user_id,
        "total": len(formatted),
        "recommendations": formatted,
    }


@router.get("/trending/locations")
async def get_trending_locations():
    """
    Returns locations ranked by social media sentiment.
    Useful for the Explore screen's 'Trending' section.
    """
    from app.ml.sentiment_analysis import aggregate_location_sentiment

    scraped_posts = []
    scraped_collection = db["scraped_posts"]
    async for post in scraped_collection.find({}).limit(1000):
        post.pop("_id", None)
        scraped_posts.append(post)

    if not scraped_posts:
        return {"trending": [], "message": "No scraped data yet. Run scraper first."}

    sentiment_map = aggregate_location_sentiment(scraped_posts)

    # Sort by avg_rating and post_count
    trending = [
        {"location": loc, **data}
        for loc, data in sentiment_map.items()
    ]
    trending.sort(key=lambda x: (x["avg_rating"], x["post_count"]), reverse=True)

    return {"trending": trending[:10]}