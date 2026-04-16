# backend-hike/app/scraper/instagram_scraper.py
# Scrapes hiking-related posts from Instagram using public hashtag pages

import httpx
import json
import re
from datetime import datetime
from typing import Optional
from app.scraper.scraper_utils import clean_text, extract_hashtags

HIKING_HASHTAGS = [
    "hikingnorthernpakistan",
    "karakoramhighway",
    "gilgitbaltistan",
    "skardu",
    "hunzavalley",
    "nathiagali",
    "swatvalley",
    "chitralhiking",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


async def scrape_instagram_hashtag(hashtag: str, max_posts: int = 20) -> list[dict]:
    """
    Scrapes public Instagram posts for a given hashtag.
    Returns list of post dicts with text, likes, timestamp, location info.
    """
    url = f"https://www.instagram.com/explore/tags/{hashtag}/?__a=1&__d=dis"
    posts = []

    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=15.0) as client:
            response = await client.get(url)

            if response.status_code != 200:
                print(f"[Instagram] Failed to fetch #{hashtag}: {response.status_code}")
                return []

            # Instagram returns JSON wrapped in HTML sometimes, try to parse
            try:
                data = response.json()
            except Exception:
                # Try to extract JSON from HTML response
                match = re.search(r'window\._sharedData\s*=\s*({.*?});</script>', response.text, re.DOTALL)
                if not match:
                    return []
                data = json.loads(match.group(1))

            # Navigate the JSON structure
            edges = (
                data.get("graphql", {})
                .get("hashtag", {})
                .get("edge_hashtag_to_media", {})
                .get("edges", [])
            )

            for edge in edges[:max_posts]:
                node = edge.get("node", {})
                caption_edges = node.get("edge_media_to_caption", {}).get("edges", [])
                caption = caption_edges[0]["node"]["text"] if caption_edges else ""

                post = {
                    "source": "instagram",
                    "hashtag": hashtag,
                    "post_id": node.get("id", ""),
                    "text": clean_text(caption),
                    "hashtags": extract_hashtags(caption),
                    "likes": node.get("edge_liked_by", {}).get("count", 0),
                    "comments": node.get("edge_media_to_comment", {}).get("count", 0),
                    "image_url": node.get("thumbnail_src", ""),
                    "timestamp": datetime.utcfromtimestamp(
                        node.get("taken_at_timestamp", 0)
                    ).isoformat(),
                    "scraped_at": datetime.utcnow().isoformat(),
                }
                posts.append(post)

    except Exception as e:
        print(f"[Instagram Scraper Error] #{hashtag}: {e}")

    return posts


async def scrape_all_hiking_hashtags(max_per_tag: int = 15) -> list[dict]:
    """
    Loops through all HIKING_HASHTAGS and collects posts from each.
    """
    all_posts = []
    for tag in HIKING_HASHTAGS:
        print(f"[Scraper] Fetching #{tag}...")
        posts = await scrape_instagram_hashtag(tag, max_posts=max_per_tag)
        all_posts.extend(posts)
        print(f"[Scraper] Got {len(posts)} posts from #{tag}")
    return all_posts