# backend-hike/app/routes/scraper.py
# API endpoints to trigger and manage social media scraping

from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.scraper.instagram_scraper import scrape_all_hiking_hashtags
from app.scraper.facebook_scraper import scrape_all_fb_pages
from app.scraper.scraper_utils import deduplicate_posts
from app.ml.sentiment_analysis import batch_analyze_sentiment
from app.database import db
from datetime import datetime

router = APIRouter(prefix="/api/scraper", tags=["Scraper"])

scraped_collection = db["scraped_posts"]


async def run_full_scrape():
    """
    Full scraping pipeline:
    1. Scrape Instagram hashtags
    2. Scrape Facebook pages
    3. Deduplicate posts
    4. Run sentiment analysis on each post
    5. Save to DB
    """
    print("[Scraper] Starting full scrape pipeline...")

    # Step 1: Scrape
    instagram_posts = await scrape_all_hiking_hashtags(max_per_tag=15)
    facebook_posts = await scrape_all_fb_pages(max_per_page=10)

    all_posts = instagram_posts + facebook_posts
    print(f"[Scraper] Total raw posts: {len(all_posts)}")

    # Step 2: Deduplicate
    unique_posts = deduplicate_posts(all_posts)
    print(f"[Scraper] After dedup: {len(unique_posts)}")

    # Step 3: Sentiment analysis
    analyzed_posts = batch_analyze_sentiment(unique_posts)
    print(f"[Scraper] Sentiment analysis done ✅")

    # Step 4: Save to DB (upsert by post_id)
    saved = 0
    for post in analyzed_posts:
        post_id = post.get("post_id", "")
        if post_id:
            await scraped_collection.update_one(
                {"post_id": post_id},
                {"$set": {**post, "updated_at": datetime.utcnow().isoformat()}},
                upsert=True,
            )
        else:
            await scraped_collection.insert_one(post)
        saved += 1

    print(f"[Scraper] Saved {saved} posts to DB ✅")
    return saved


@router.post("/trigger")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """
    Triggers a full scraping + sentiment analysis run in the background.
    Returns immediately; scraping happens async.

    Use this endpoint to:
    - Manually refresh social media data
    - Schedule via a cron job
    """
    background_tasks.add_task(run_full_scrape)
    return {
        "message": "Scraping started in background ✅",
        "note": "Check /api/scraper/stats after a few minutes to see results."
    }


@router.get("/stats")
async def get_scraper_stats():
    """
    Returns stats about the scraped data in the DB.
    """
    total = await scraped_collection.count_documents({})
    instagram = await scraped_collection.count_documents({"source": "instagram"})
    facebook = await scraped_collection.count_documents({"source": "facebook"})

    positive = await scraped_collection.count_documents({"sentiment.label": "POSITIVE"})
    negative = await scraped_collection.count_documents({"sentiment.label": "NEGATIVE"})
    neutral = await scraped_collection.count_documents({"sentiment.label": "NEUTRAL"})

    return {
        "total_posts": total,
        "by_source": {"instagram": instagram, "facebook": facebook},
        "by_sentiment": {"positive": positive, "negative": negative, "neutral": neutral},
    }


@router.delete("/clear")
async def clear_scraped_data():
    """
    Clears all scraped posts from the DB.
    Use with caution — only for dev/testing.
    """
    result = await scraped_collection.delete_many({})
    return {"message": f"Deleted {result.deleted_count} scraped posts."}