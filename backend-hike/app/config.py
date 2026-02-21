# backend-hike/app/config.py

import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "hikeplanner")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not found in .env")

print("✅ GROQ_API_KEY loaded:", bool(GROQ_API_KEY))
print("✅ MongoDB URL:", MONGODB_URL)