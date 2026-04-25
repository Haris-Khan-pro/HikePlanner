# app/scraper/reddit_scraper.py
import httpx
from datetime import datetime, timezone
from app.scraper.scraper_utils import clean_text, extract_hashtags

REDDIT_USER_AGENT = "HikePlannerBot/1.0"

HIKING_SEARCHES = [
    "pakistan+hiking",
    "gilgit+baltistan",
    "hunza+trek",
    "k2+base+camp",
    "fairy+meadows",
    "nanga+parbat",
    "skardu",
]

async def search_reddit(query: str, max_posts: int = 15) -> list[dict]:
    posts = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"https://www.reddit.com/search.json",
                params={
                    "q":      query,
                    "sort":   "new",
                    "limit":  max_posts,
                },
                headers={"User-Agent": REDDIT_USER_AGENT},
            )
            resp.raise_for_status()
            children = resp.json().get("data", {}).get("children", [])

            for child in children:
                data = child.get("data", {})
                text = f"{data.get('title', '')} {data.get('selftext', '')}".strip()
                if len(text) < 20:
                    continue
                post = {
                    "source":    "reddit",
                    "hashtag":   query,
                    "post_id":   data.get("id", ""),
                    "text":      clean_text(text),
                    "hashtags":  extract_hashtags(text),
                    "likes":     data.get("ups", 0),
                    "comments":  data.get("num_comments", 0),
                    "image_url": data.get("thumbnail", ""),
                    "url":       f"https://reddit.com{data.get('permalink', '')}",
                    "subreddit": data.get("subreddit", ""),
                    "timestamp": datetime.fromtimestamp(
                        data.get("created_utc", 0), tz=timezone.utc
                    ).isoformat(),
                    "scraped_at": datetime.now(timezone.utc).isoformat(),
                }
                posts.append(post)

    except Exception as e:
        print(f"[Reddit Scraper Error] query='{query}': {e}")

    return posts


async def scrape_all_hiking_keywords(max_per_keyword: int = 15) -> list[dict]:
    all_posts = []
    for keyword in HIKING_SEARCHES:
        print(f"[Reddit Scraper] Searching: '{keyword}'...")
        posts = await search_reddit(keyword, max_posts=max_per_keyword)
        all_posts.extend(posts)
        print(f"[Reddit Scraper] Got {len(posts)} posts for '{keyword}'")
    return all_posts