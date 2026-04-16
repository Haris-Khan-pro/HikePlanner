# backend-hike/app/ml/sentiment_analysis.py
# Performs sentiment analysis on scraped social media posts about hiking locations

from transformers import pipeline
from typing import Optional
import re

# Load a lightweight multilingual sentiment model
# Works for both English and Roman Urdu (transliterated)
_sentiment_pipeline = None


def get_sentiment_pipeline():
    """
    Lazy-loads the sentiment model so it doesn't slow down server startup.
    Uses distilbert for fast inference on CPU.
    """
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        print("[ML] Loading sentiment model... (first time only)")
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            truncation=True,
            max_length=512,
        )
        print("[ML] Sentiment model loaded ✅")
    return _sentiment_pipeline


def analyze_sentiment(text: str) -> dict:
    """
    Analyzes sentiment of a single text string.

    Returns:
        {
            "label": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
            "score": float (0.0 - 1.0),
            "rating": float (1.0 - 5.0)  # mapped for star ratings
        }
    """
    if not text or len(text.strip()) < 10:
        return {"label": "NEUTRAL", "score": 0.5, "rating": 3.0}

    try:
        pipe = get_sentiment_pipeline()
        result = pipe(text[:512])[0]  # Truncate to model limit

        label = result["label"]  # "POSITIVE" or "NEGATIVE"
        score = result["score"]  # Confidence 0-1

        # Map to star rating (1-5)
        if label == "POSITIVE":
            rating = 3.0 + (score * 2.0)  # 3.0 - 5.0
        else:
            rating = 3.0 - (score * 2.0)  # 1.0 - 3.0

        # Detect neutral-ish cases
        if score < 0.65:
            label = "NEUTRAL"
            rating = 3.0

        return {
            "label": label,
            "score": round(score, 4),
            "rating": round(rating, 2),
        }

    except Exception as e:
        print(f"[Sentiment Error] {e}")
        return {"label": "NEUTRAL", "score": 0.5, "rating": 3.0}


def batch_analyze_sentiment(posts: list[dict]) -> list[dict]:
    """
    Analyzes sentiment for a list of post dicts.
    Adds 'sentiment' key to each post dict in-place.

    Each post must have a 'text' field.
    """
    for post in posts:
        text = post.get("text", "")
        sentiment = analyze_sentiment(text)
        post["sentiment"] = sentiment
    return posts


def aggregate_location_sentiment(posts: list[dict]) -> dict[str, dict]:
    """
    Groups posts by detected location hints and aggregates sentiment scores.

    Returns a dict like:
    {
        "skardu": {"avg_rating": 4.2, "post_count": 15, "label": "POSITIVE"},
        "hunza":  {"avg_rating": 4.7, "post_count": 23, "label": "POSITIVE"},
        ...
    }
    """
    from app.scraper.scraper_utils import extract_location_hints

    location_data: dict[str, list[float]] = {}

    for post in posts:
        sentiment = post.get("sentiment", {})
        rating = sentiment.get("rating", 3.0)
        locations = extract_location_hints(post.get("text", ""))

        for loc in locations:
            if loc not in location_data:
                location_data[loc] = []
            location_data[loc].append(rating)

    # Aggregate
    result = {}
    for loc, ratings in location_data.items():
        avg = sum(ratings) / len(ratings)
        result[loc] = {
            "avg_rating": round(avg, 2),
            "post_count": len(ratings),
            "label": "POSITIVE" if avg >= 3.5 else "NEGATIVE" if avg < 2.5 else "NEUTRAL",
        }

    return result