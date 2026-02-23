# backend-hike/app/database.py

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

# Open the connection to MongoDB
client = AsyncIOMotorClient(MONGODB_URL)

# Pick our database
db = client[DATABASE_NAME]

# Our "users" drawer/collection
users_collection = db["users"]