from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

# This is like "opening" the filing cabinet
client = AsyncIOMotorClient(MONGODB_URL)

# This picks the specific database (filing cabinet name)
db = client[DATABASE_NAME]

# These are our "drawers" (collections)
users_collection = db["users"]
hikes_collection = db["hikes"]
chat_history_collection = db["chat_history"]