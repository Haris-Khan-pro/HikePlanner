# backend-hike/app/ml/recommendation_engine.py
# Generates personalized trail recommendations based on user history + sentiment data

from app.database import hikes_collection, db
from app.ml.sentiment_analysis import aggregate_location_sentiment
from typing import Optional


async def get_user_preferences(clerk_user_id: str) -> dict:
    """
    Builds a preference profile from user's past hikes.

    Returns:
        {
            "preferred_difficulty": "Moderate",
            "avg_distance": 8.5,
            "favorite_locations": ["skardu", "hunza"],
            "total_hikes": 5
        }
    """
    hikes = []
    async for hike in hikes_collection.find({"clerk_user_id": clerk_user_id}):
        hikes.append(hike)

    if not hikes:
        return {
            "preferred_difficulty": "Moderate",
            "avg_distance": 10.0,
            "favorite_locations": [],
            "total_hikes": 0,
        }

    # Count difficulty preferences
    difficulty_count: dict[str, int] = {}
    distances = []
    location_count: dict[str, int] = {}

    for hike in hikes:
        diff = hike.get("difficulty", "Moderate")
        difficulty_count[diff] = difficulty_count.get(diff, 0) + 1

        dist = hike.get("distance", 0)
        if dist:
            distances.append(dist)

        loc = hike.get("location", "").lower()
        if loc:
            location_count[loc] = location_count.get(loc, 0) + 1

    preferred_difficulty = max(difficulty_count, key=difficulty_count.get)
    avg_distance = sum(distances) / len(distances) if distances else 10.0
    favorite_locations = sorted(location_count, key=location_count.get, reverse=True)[:3]

    return {
        "preferred_difficulty": preferred_difficulty,
        "avg_distance": round(avg_distance, 2),
        "favorite_locations": favorite_locations,
        "total_hikes": len(hikes),
    }


async def get_recommended_trails(
    clerk_user_id: str,
    all_trails: list[dict],
    scraped_posts: Optional[list[dict]] = None,
    top_n: int = 5,
) -> list[dict]:
    """
    Scores and ranks trails for a specific user based on:
    1. User preference match (difficulty, distance)
    2. Social media sentiment score for that trail's location
    3. Trail's own rating

    Returns top_n recommended trails with a 'recommendation_score'.
    """
    preferences = await get_user_preferences(clerk_user_id)

    # Build sentiment map if scraped posts are available
    sentiment_map: dict[str, dict] = {}
    if scraped_posts:
        sentiment_map = aggregate_location_sentiment(scraped_posts)

    difficulty_order = ["Easy", "Moderate", "Hard", "Expert"]
    preferred_idx = difficulty_order.index(preferences["preferred_difficulty"])

    scored_trails = []

    for trail in all_trails:
        score = 0.0

        # 1. Difficulty match (closer = higher score)
        trail_diff = trail.get("difficulty", "Moderate")
        if trail_diff in difficulty_order:
            trail_idx = difficulty_order.index(trail_diff)
            diff_gap = abs(preferred_idx - trail_idx)
            score += max(0, 4 - diff_gap) * 1.5  # Max 6 pts

        # 2. Distance match
        trail_dist = trail.get("distance", 0)
        pref_dist = preferences["avg_distance"]
        if trail_dist > 0:
            dist_diff = abs(trail_dist - pref_dist)
            if dist_diff <= 2:
                score += 3.0
            elif dist_diff <= 5:
                score += 1.5

        # 3. Location sentiment from social media
        trail_location = trail.get("location", "").lower()
        for loc_key, sentiment_data in sentiment_map.items():
            if loc_key in trail_location:
                sentiment_rating = sentiment_data.get("avg_rating", 3.0)
                score += sentiment_rating  # Max ~5 pts

        # 4. Trail's own base rating
        base_rating = trail.get("rating", 3.0)
        score += base_rating  # Max 5 pts

        # 5. Bonus if location matches user's favorites
        for fav_loc in preferences["favorite_locations"]:
            if fav_loc in trail_location:
                score += 2.0
                break

        trail_copy = dict(trail)
        trail_copy["recommendation_score"] = round(score, 2)
        scored_trails.append(trail_copy)

    # Sort by score descending
    scored_trails.sort(key=lambda t: t["recommendation_score"], reverse=True)

    return scored_trails[:top_n]