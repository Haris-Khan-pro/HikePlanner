# backend-hike/app/scraper/scraper_utils.py
# Shared utility functions used by all scrapers

import re
import unicodedata


def clean_text(text: str) -> str:
    """
    Removes emojis, extra whitespace, and normalizes unicode text.
    """
    if not text:
        return ""

    # Normalize unicode
    text = unicodedata.normalize("NFKD", text)

    # Remove URLs
    text = re.sub(r'http\S+|www\.\S+', '', text)

    # Remove emojis (basic range)
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"
        "\U0001F300-\U0001F5FF"
        "\U0001F680-\U0001F6FF"
        "\U0001F1E0-\U0001F1FF"
        "\U00002700-\U000027BF"
        "\U0001F900-\U0001F9FF"
        "]+",
        flags=re.UNICODE,
    )
    text = emoji_pattern.sub('', text)

    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def extract_hashtags(text: str) -> list[str]:
    """
    Extracts all hashtags from a post's text.
    Example: "Great hike! #Skardu #mountains" -> ["Skardu", "mountains"]
    """
    if not text:
        return []
    hashtags = re.findall(r'#(\w+)', text)
    return [tag.lower() for tag in hashtags]


def extract_location_hints(text: str) -> list[str]:
    """
    Tries to find location keywords from a post's text
    by matching against a known list of northern Pakistan areas.
    """
    known_locations = [
        "skardu", "hunza", "nathiagali", "swat", "chitral",
        "gilgit", "naran", "kaghan", "murree", "abbottabad",
        "fairy meadows", "deosai", "k2", "rakaposhi", "naltar",
        "ghizer", "astore", "shimshal", "passu", "karimabad",
    ]

    text_lower = text.lower()
    found = [loc for loc in known_locations if loc in text_lower]
    return found


def deduplicate_posts(posts: list[dict]) -> list[dict]:
    """
    Removes duplicate posts based on post_id.
    """
    seen = set()
    unique = []
    for post in posts:
        pid = post.get("post_id", "")
        if pid and pid not in seen:
            seen.add(pid)
            unique.append(post)
        elif not pid:
            unique.append(post)  # Keep posts without IDs (Facebook mbasic)
    return unique