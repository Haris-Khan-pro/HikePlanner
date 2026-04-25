# app/routes/scraper.py
from fastapi import APIRouter, BackgroundTasks
from app.scraper.reddit_scraper import scrape_all_hiking_keywords
from app.scraper.scraper_utils import deduplicate_posts
from app.ml.sentiment_analysis import batch_analyze_sentiment
from app.database import db
from datetime import datetime, timezone

router = APIRouter(prefix="/api/scraper", tags=["Scraper"])
scraped_collection = db["scraped_posts"]


async def run_full_scrape():
    """
    Full scraping pipeline:
    1. Fetch Reddit posts by hiking keywords
    2. Deduplicate
    3. Run sentiment analysis
    4. Save to DB (upsert by post_id)
    """
    print("[Scraper] Starting Reddit scrape pipeline...")

    # Step 1: Scrape Reddit
    reddit_posts = await scrape_all_hiking_keywords(max_per_keyword=15)
    print(f"[Scraper] Total raw posts: {len(reddit_posts)}")

    # Step 2: Deduplicate
    unique_posts = deduplicate_posts(reddit_posts)
    print(f"[Scraper] After dedup: {len(unique_posts)}")

    # Step 3: Sentiment analysis
    analyzed_posts = batch_analyze_sentiment(unique_posts)
    print(f"[Scraper] Sentiment analysis done ✅")

    # Step 4: Save to DB
    saved = 0
    for post in analyzed_posts:
        post_id = post.get("post_id", "")
        if post_id:
            await scraped_collection.update_one(
                {"post_id": post_id},
                {"$set": {**post, "updated_at": datetime.now(timezone.utc).isoformat()}},
                upsert=True,
            )
        else:
            await scraped_collection.insert_one(post)
        saved += 1

    print(f"[Scraper] Saved {saved} posts to DB ✅")
    return saved


@router.post("/trigger")
async def trigger_scrape(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_full_scrape)
    return {
        "message": "Reddit scraping started in background 🚀",
        "note": "Check /api/scraper/stats after a minute to see results.",
    }


@router.get("/posts")
async def get_scraped_posts(limit: int = 20, source: str = None):
    """Returns scraped posts from the DB, optionally filtered by source."""
    query = {}
    if source:
        query["source"] = source
    posts = []
    async for post in scraped_collection.find(query).sort("scraped_at", -1).limit(limit):
        post["id"] = str(post["_id"])
        del post["_id"]
        posts.append(post)
    return posts


@router.get("/stats")
async def get_scraper_stats():
    total    = await scraped_collection.count_documents({})
    reddit   = await scraped_collection.count_documents({"source": "reddit"})
    positive = await scraped_collection.count_documents({"sentiment.label": "POSITIVE"})
    negative = await scraped_collection.count_documents({"sentiment.label": "NEGATIVE"})
    neutral  = await scraped_collection.count_documents({"sentiment.label": "NEUTRAL"})
    return {
        "total_posts": total,
        "by_source":   {"reddit": reddit},
        "by_sentiment": {
            "positive": positive,
            "negative": negative,
            "neutral":  neutral,
        },
    }


@router.delete("/clear")
async def clear_scraped_data():
    result = await scraped_collection.delete_many({})
    return {"message": f"Deleted {result.deleted_count} scraped posts."}