# backend-hike/app/scraper/facebook_scraper.py
# Scrapes hiking-related public Facebook posts and groups

import httpx
import re
from datetime import datetime
from app.scraper.scraper_utils import clean_text, extract_hashtags

# Public Facebook hiking groups/pages for northern Pakistan
FB_PAGES = [
    "HikingInPakistan",
    "GilgitBaltistanTourism",
    "SkarduHikers",
    "HunzaTourism",
    "NorthernPakistanAdventure",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
}


async def scrape_facebook_page(page_name: str, max_posts: int = 15) -> list[dict]:
    """
    Scrapes public Facebook page posts via mbasic.facebook.com (no login required).
    Returns list of post dicts.
    """
    url = f"https://mbasic.facebook.com/{page_name}"
    posts = []

    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=15.0, follow_redirects=True) as client:
            response = await client.get(url)

            if response.status_code != 200:
                print(f"[Facebook] Failed to fetch {page_name}: {response.status_code}")
                return []

            html = response.text

            # Extract post text blocks from mbasic HTML
            # mbasic renders posts as <div> with data-ft attributes
            post_blocks = re.findall(
                r'<div[^>]*data-ft[^>]*>(.*?)</div>\s*</div>',
                html,
                re.DOTALL
            )

            for i, block in enumerate(post_blocks[:max_posts]):
                # Strip HTML tags to get raw text
                raw_text = re.sub(r'<[^>]+>', ' ', block)
                raw_text = re.sub(r'\s+', ' ', raw_text).strip()

                if len(raw_text) < 30:  # Skip too-short fragments
                    continue

                post = {
                    "source": "facebook",
                    "page": page_name,
                    "post_id": f"{page_name}_{i}",
                    "text": clean_text(raw_text),
                    "hashtags": extract_hashtags(raw_text),
                    "likes": 0,  # mbasic doesn't expose like counts easily
                    "comments": 0,
                    "image_url": "",
                    "timestamp": datetime.utcnow().isoformat(),
                    "scraped_at": datetime.utcnow().isoformat(),
                }
                posts.append(post)

    except Exception as e:
        print(f"[Facebook Scraper Error] {page_name}: {e}")

    return posts


async def scrape_all_fb_pages(max_per_page: int = 10) -> list[dict]:
    """
    Loops through all FB_PAGES and collects posts.
    """
    all_posts = []
    for page in FB_PAGES:
        print(f"[Scraper] Fetching Facebook page: {page}...")
        posts = await scrape_facebook_page(page, max_posts=max_per_page)
        all_posts.extend(posts)
        print(f"[Scraper] Got {len(posts)} posts from {page}")
    return all_posts