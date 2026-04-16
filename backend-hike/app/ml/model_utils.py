# backend-hike/app/ml/model_utils.py
# Helper utilities shared across ML modules

from datetime import datetime


def normalize_score(score: float, min_val: float = 0.0, max_val: float = 20.0) -> float:
    """
    Normalizes a raw recommendation score to a 0-10 scale.
    """
    if max_val == min_val:
        return 5.0
    normalized = (score - min_val) / (max_val - min_val) * 10
    return round(max(0.0, min(10.0, normalized)), 2)


def score_to_stars(score: float, max_score: float = 20.0) -> float:
    """
    Converts raw recommendation score to 1-5 star rating.
    """
    stars = 1.0 + (score / max_score) * 4.0
    return round(min(5.0, max(1.0, stars)), 1)


def label_from_rating(rating: float) -> str:
    """
    Returns a human-readable label for a rating value.
    """
    if rating >= 4.5:
        return "Highly Recommended"
    elif rating >= 3.5:
        return "Recommended"
    elif rating >= 2.5:
        return "Mixed Reviews"
    else:
        return "Not Recommended"


def format_recommendation_response(trails: list[dict]) -> list[dict]:
    """
    Formats the recommendation results for API response.
    Adds human-readable label and normalized score.
    """
    if not trails:
        return []

    max_score = max(t.get("recommendation_score", 0) for t in trails) or 1.0

    formatted = []
    for trail in trails:
        raw_score = trail.get("recommendation_score", 0)
        normalized = normalize_score(raw_score, 0, max_score * 1.2)
        formatted.append({
            **trail,
            "recommendation_score": raw_score,
            "recommendation_normalized": normalized,
            "recommendation_label": label_from_rating(trail.get("rating", 3.0)),
            "recommendation_stars": score_to_stars(raw_score, max_score * 1.2),
        })

    return formatted


def log_recommendation_event(user_id: str, trail_ids: list[str]) -> None:
    """
    Simple console log for recommendation events.
    Can be extended to write to DB for analytics.
    """
    print(
        f"[Recommendations] {datetime.utcnow().isoformat()} | "
        f"User: {user_id} | Trails: {trail_ids}"
    )