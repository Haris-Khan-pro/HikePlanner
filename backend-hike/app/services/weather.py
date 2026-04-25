import os
import httpx
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OPENWEATHER_BASE    = "https://api.openweathermap.org/data/2.5/weather"

# ── Simple in-memory cache ────────────────────────────────────────────────────
# Stores: { "lat,lon": { "data": {...}, "fetched_at": datetime } }
_cache: dict = {}
CACHE_TTL_MINUTES = 10


def _cache_key(lat: float, lon: float) -> str:
    return f"{round(lat, 4)},{round(lon, 4)}"


def _is_fresh(fetched_at: datetime) -> bool:
    age_minutes = (datetime.now(timezone.utc) - fetched_at).total_seconds() / 60
    return age_minutes < CACHE_TTL_MINUTES


async def get_weather(lat: float, lon: float) -> Optional[dict]:
    """
    Fetches current weather for a (lat, lon) coordinate.
    Returns a clean dict or None if the API key is missing / call fails.
    Caches results for 10 minutes to avoid hammering the free tier.
    """
    if not OPENWEATHER_API_KEY:
        return None

    key = _cache_key(lat, lon)

    # Return cached result if still fresh
    if key in _cache and _is_fresh(_cache[key]["fetched_at"]):
        return _cache[key]["data"]

    # Fetch from OpenWeatherMap
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                OPENWEATHER_BASE,
                params={
                    "lat":   lat,
                    "lon":   lon,
                    "appid": OPENWEATHER_API_KEY,
                    "units": "metric",   # Celsius
                },
            )
            resp.raise_for_status()
            raw = resp.json()
    except Exception:
        # Return stale cache if available rather than failing completely
        if key in _cache:
            return _cache[key]["data"]
        return None

    # Parse into a clean, frontend-friendly shape
    weather = {
        "temperature":  raw["main"]["temp"],
        "feels_like":   raw["main"]["feels_like"],
        "humidity":     raw["main"]["humidity"],
        "description":  raw["weather"][0]["description"].capitalize(),
        "icon":         raw["weather"][0]["icon"],
        "icon_url":     f"https://openweathermap.org/img/wn/{raw['weather'][0]['icon']}@2x.png",
        "wind_speed":   raw["wind"]["speed"],        # m/s
        "wind_deg":     raw["wind"].get("deg", 0),
        "visibility":   raw.get("visibility", 0),    # meters
        "city":         raw.get("name", ""),
        "fetched_at":   datetime.now(timezone.utc).isoformat(),
    }

    # Store in cache
    _cache[key] = {
        "data":       weather,
        "fetched_at": datetime.now(timezone.utc),
    }

    return weather