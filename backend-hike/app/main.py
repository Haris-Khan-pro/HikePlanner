from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, hikes, chat

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
app.include_router(hikes.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"status": "Hike Planner Backend Running 🏔️"}