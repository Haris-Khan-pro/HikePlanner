# backend-hike/app/database.py

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Collections
users_collection      = db["users"]
trails_collection     = db["trails"]
activities_collection = db["activities"]
reviews_collection    = db["reviews"]
chat_history_collection = db["chat_history"]
scraped_posts_collection = db["scraped_posts"]
trails_collection = db["trails"]
hikes_collection = db["hikes"]