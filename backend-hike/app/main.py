# backend-hike/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, trails, activities, review, chat, recommendations, scraper

app = FastAPI(title="Hike Planner AI Backend")

# Allow Expo / Mobile access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(users.router)
app.include_router(trails.router)
app.include_router(activities.router)
app.include_router(review.router)
app.include_router(chat.router)
app.include_router(recommendations.router)
app.include_router(scraper.router)

@app.get("/")
def root():
    return {"status": "Hike Planner Backend Running 🏔️"}