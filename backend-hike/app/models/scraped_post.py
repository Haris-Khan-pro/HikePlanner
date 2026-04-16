# backend-hike/app/models/scraped_post.py
# Pydantic model for scraped social media posts stored in MongoDB

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SentimentResult(BaseModel):
    label: str = "NEUTRAL"       # "POSITIVE", "NEGATIVE", "NEUTRAL"
    score: float = 0.5           # Confidence 0.0 - 1.0
    rating: float = 3.0          # Mapped star rating 1.0 - 5.0


class ScrapedPost(BaseModel):
    source: str                  # "instagram" | "facebook"
    post_id: str                 # Unique ID from the platform
    hashtag: Optional[str] = None        # Instagram hashtag used
    page: Optional[str] = None           # Facebook page name
    text: str                    # Cleaned post text
    hashtags: list[str] = []     # Extracted hashtags
    likes: int = 0
    comments: int = 0
    image_url: Optional[str] = None
    timestamp: Optional[str] = None      # When the post was made
    scraped_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    sentiment: Optional[SentimentResult] = None
    location_hints: list[str] = []       # Detected location keywords


class ScrapedPostInDB(ScrapedPost):
    updated_at: Optional[str] = None