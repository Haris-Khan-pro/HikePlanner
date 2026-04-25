import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, trails, activities, review, recommendations, scraper, hikes
from app.routes.weather import router as weather_router
from app.database import ping_database
from app.database import ping_database, create_indexes

app = FastAPI(title="Hike Planner AI Backend")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Read allowed origins from .env  e.g.  ALLOWED_ORIGINS=http://localhost:8081
# Falls back to localhost only if the variable is missing (safe default).
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8081")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.on_event("startup") 
async def startup_event():
    await create_indexes() 

app.include_router(users.router)
app.include_router(trails.router)
app.include_router(activities.router)
app.include_router(review.router)
app.include_router(recommendations.router)
app.include_router(scraper.router)
app.include_router(hikes.router)
app.include_router(weather_router)


@app.get("/")
def root():
    return {"status": "Hike Planner Backend Running 🏔️"}


@app.get("/health")
async def health_check():
    db_ok = await ping_database()
    return {
        "status": "ok" if db_ok else "error",
        "database": "connected ✅" if db_ok else "NOT connected ❌",
    }