# app/routes/weather.py
from fastapi import APIRouter, HTTPException
from app.database import trails_collection
from app.services.weather import get_weather
from bson import ObjectId

router = APIRouter(prefix="/api/weather", tags=["Weather"])


@router.get("/{trail_id}")
async def get_trail_weather(trail_id: str):
    """
    Returns current weather for a trail's location.
    Uses the trail's stored latitude/longitude to fetch live data.
    Results are cached for 10 minutes.
    """
    # Look up the trail to get its coordinates
    try:
        trail = await trails_collection.find_one({"_id": ObjectId(trail_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid trail ID")

    if not trail:
        raise HTTPException(status_code=404, detail="Trail not found")

    lat = trail.get("latitude")
    lon = trail.get("longitude")

    if lat is None or lon is None:
        raise HTTPException(
            status_code=422,
            detail="Trail has no coordinates stored"
        )

    weather = await get_weather(lat, lon)

    if weather is None:
        raise HTTPException(
            status_code=503,
            detail="Weather service unavailable. Check OPENWEATHER_API_KEY in .env"
        )

    return {
        "trail_id":   trail_id,
        "trail_name": trail.get("name"),
        "latitude":   lat,
        "longitude":  lon,
        "weather":    weather,
    }


@router.get("/coords/{lat}/{lon}")
async def get_weather_by_coords(lat: float, lon: float):
    """
    Direct weather lookup by coordinates.
    Useful for the live map screen where no trail_id is available.
    """
    weather = await get_weather(lat, lon)

    if weather is None:
        raise HTTPException(
            status_code=503,
            detail="Weather service unavailable. Check OPENWEATHER_API_KEY in .env"
        )

    return {"latitude": lat, "longitude": lon, "weather": weather}