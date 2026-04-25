from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME
from pymongo import ASCENDING, DESCENDING, TEXT

client = AsyncIOMotorClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000,
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


async def create_indexes():
    """
    Creates all database indexes on startup.
    Safe to call multiple times — MongoDB skips existing indexes.
    """

    # ── Trails ────────────────────────────────────────────────────────────────
    await trails_collection.create_index([("name", ASCENDING)])
    await trails_collection.create_index([("difficulty", ASCENDING)])
    await trails_collection.create_index([("isFeatured", DESCENDING)])
    await trails_collection.create_index([("isPopular", DESCENDING)])
    await trails_collection.create_index([("rating", DESCENDING)])
    await trails_collection.create_index([("location", ASCENDING)])
    # Text index for search across name, location, tags
    await trails_collection.create_index([
        ("name",     TEXT),
        ("location", TEXT),
        ("tags",     TEXT),
    ], name="trails_text_search")

    # ── Users ─────────────────────────────────────────────────────────────────
    await users_collection.create_index(
        [("clerk_user_id", ASCENDING)], unique=True, sparse=True
    )
    await users_collection.create_index(
        [("email", ASCENDING)], unique=True
    )

    # ── Hikes ─────────────────────────────────────────────────────────────────
    await hikes_collection.create_index([("user_id", ASCENDING)])
    await hikes_collection.create_index([("created_at", DESCENDING)])
    # Compound: fetch all hikes for a user sorted by date (most common query)
    await hikes_collection.create_index([
        ("user_id",    ASCENDING),
        ("created_at", DESCENDING),
    ])

    # ── Reviews ───────────────────────────────────────────────────────────────
    await reviews_collection.create_index([("trail_id", ASCENDING)])
    await reviews_collection.create_index([("user_id",  ASCENDING)])
    await reviews_collection.create_index([
        ("trail_id", ASCENDING),
        ("user_id",  ASCENDING),
    ], unique=True)   # one review per user per trail

    # ── Activities ────────────────────────────────────────────────────────────
    await activities_collection.create_index([("user_id",    ASCENDING)])
    await activities_collection.create_index([("created_at", DESCENDING)])

    # ── Scraped Posts ─────────────────────────────────────────────────────────
    await scraped_posts_collection.create_index(
        [("post_id", ASCENDING)], unique=True
    )
    await scraped_posts_collection.create_index([("source",           ASCENDING)])
    await scraped_posts_collection.create_index([("sentiment.label",  ASCENDING)])
    await scraped_posts_collection.create_index([("scraped_at",       DESCENDING)])

    # ── Chat History ──────────────────────────────────────────────────────────
    await chat_history_collection.create_index([("user_id",   ASCENDING)])
    await chat_history_collection.create_index([("timestamp", DESCENDING)])

    print("✅ Database indexes created")


async def ping_database() -> bool:
    """Returns True if MongoDB is reachable, False otherwise."""
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        return False