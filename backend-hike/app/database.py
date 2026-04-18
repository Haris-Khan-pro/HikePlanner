from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

client = AsyncIOMotorClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000,   # give up after 5 seconds if can't connect
    connectTimeoutMS=5000,
    socketTimeoutMS=10000,
)

db = client[DATABASE_NAME]

# Collections
users_collection         = db["users"]
trails_collection        = db["trails"]
activities_collection    = db["activities"]
reviews_collection       = db["reviews"]
chat_history_collection  = db["chat_history"]
scraped_posts_collection = db["scraped_posts"]
hikes_collection         = db["hikes"]


async def ping_database() -> bool:
    """Returns True if MongoDB is reachable, False otherwise."""
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        return False