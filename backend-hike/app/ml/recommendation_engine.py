# app/ml/recommendation_engine.py
from app.database import hikes_collection, db
from app.ml.sentiment_analysis import aggregate_location_sentiment
from typing import Optional

DIFFICULTY_ORDER = ["Easy", "Moderate", "Hard", "Expert"]

def _normalize_difficulty(raw: str) -> str:
    """Normalizes any casing variant to title case e.g. 'easy' → 'Easy'"""
    mapping = {
        "easy":     "Easy",
        "moderate": "Moderate",
        "medium":   "Moderate",   # frontend uses 'medium'
        "hard":     "Hard",
        "expert":   "Expert",
    }
    return mapping.get(raw.strip().lower(), "Moderate")


async def get_user_preferences(clerk_user_id: str) -> dict:
    """
    Builds a preference profile from user's past hikes.
    Queries by user_id field (what HikeCreate actually stores).
    """
    hikes = []
    # Fix: query by user_id, not clerk_user_id
    async for hike in hikes_collection.find({"user_id": clerk_user_id}):
        hikes.append(hike)

    if not hikes:
        return {
            "preferred_difficulty": "Moderate",
            "avg_distance":         10.0,
            "favorite_locations":   [],
            "total_hikes":          0,
        }

    difficulty_count: dict[str, int] = {}
    distances = []
    location_count: dict[str, int] = {}

    for hike in hikes:
        # Normalize difficulty before counting
        raw_diff = hike.get("difficulty", "Moderate")
        diff = _normalize_difficulty(raw_diff)
        difficulty_count[diff] = difficulty_count.get(diff, 0) + 1

        # HikeCreate uses distance_km not distance
        dist = hike.get("distance_km") or hike.get("distance", 0)
        if dist:
            distances.append(dist)

        loc = hike.get("location", "").lower()
        if loc:
            location_count[loc] = location_count.get(loc, 0) + 1

    preferred_difficulty = max(difficulty_count, key=difficulty_count.get)
    avg_distance = sum(distances) / len(distances) if distances else 10.0
    favorite_locations = sorted(
        location_count, key=location_count.get, reverse=True
    )[:3]

    return {
        "preferred_difficulty": preferred_difficulty,
        "avg_distance":         round(avg_distance, 2),
        "favorite_locations":   favorite_locations,
        "total_hikes":          len(hikes),
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
    4. Bonus for favorite locations
    Returns top_n recommended trails with a 'recommendation_score'.
    """
    preferences = await get_user_preferences(clerk_user_id)

    sentiment_map: dict[str, dict] = {}
    if scraped_posts:
        sentiment_map = aggregate_location_sentiment(scraped_posts)

    preferred_idx = DIFFICULTY_ORDER.index(preferences["preferred_difficulty"])
    is_new_user = preferences["total_hikes"] == 0

    scored_trails = []
    for trail in all_trails:
        score = 0.0

        # 1. Difficulty match
        raw_diff = trail.get("difficulty", "Moderate")
        trail_diff = _normalize_difficulty(raw_diff)
        if trail_diff in DIFFICULTY_ORDER:
            trail_idx = DIFFICULTY_ORDER.index(trail_diff)
            diff_gap = abs(preferred_idx - trail_idx)
            score += max(0, 4 - diff_gap) * 1.5   # Max 6 pts

        # 2. Distance match
        trail_dist = trail.get("distance", 0)
        pref_dist  = preferences["avg_distance"]
        if trail_dist > 0:
            dist_diff = abs(trail_dist - pref_dist)
            if dist_diff <= 2:
                score += 3.0
            elif dist_diff <= 5:
                score += 1.5

        # 3. Location sentiment from Reddit posts
        trail_location = trail.get("location", "").lower()
        for loc_key, sentiment_data in sentiment_map.items():
            if loc_key in trail_location:
                score += sentiment_data.get("avg_rating", 3.0)

        # 4. Trail's own base rating
        score += trail.get("rating", 3.0)

        # 5. Bonus for user's favorite locations
        for fav_loc in preferences["favorite_locations"]:
            if fav_loc in trail_location:
                score += 2.0
                break

        # 6. For new users: boost featured/popular trails
        if is_new_user:
            if trail.get("isFeatured"):
                score += 2.0
            if trail.get("isPopular"):
                score += 1.5

        trail_copy = dict(trail)
        trail_copy["recommendation_score"] = round(score, 2)
        trail_copy["is_personalized"] = not is_new_user  # tells frontend if personalized
        scored_trails.append(trail_copy)

    scored_trails.sort(key=lambda t: t["recommendation_score"], reverse=True)
    return scored_trails[:top_n]