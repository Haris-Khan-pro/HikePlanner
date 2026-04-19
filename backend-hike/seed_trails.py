import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# ── Connect directly (no need to import app) ─────────────────────────────────
MONGODB_URL = "mongodb+srv://aazibali07:Hariskhan07@cluster0.vwpei60.mongodb.net/hikeplanner?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "hikeplanner"

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]
trails_collection = db["trails"]

# ── 12 Pakistani Trails ───────────────────────────────────────────────────────
TRAILS = [
    {
        "name": "Fairy Meadows Trail",
        "location": "Nanga Parbat, Gilgit-Baltistan",
        "description": "One of Pakistan's most iconic hikes leading to breathtaking views of Nanga Parbat, the world's 9th highest peak. The trail passes through dense pine forests and alpine meadows.",
        "distance": 14.0,
        "duration": 300,
        "difficulty": "Moderate",
        "elevation": 3300.0,
        "latitude": 35.3753,
        "longitude": 74.5864,
        "image": None,
        "tags": ["alpine", "meadows", "nanga parbat", "forest"],
        "isFeatured": True,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Nanga Parbat Base Camp",
        "location": "Diamer, Gilgit-Baltistan",
        "description": "A challenging trek to the base camp of Nanga Parbat — the Killer Mountain. Offers dramatic views of the massive Rupal and Diamir faces of this iconic peak.",
        "distance": 28.5,
        "duration": 540,
        "difficulty": "Hard",
        "elevation": 4200.0,
        "latitude": 35.2372,
        "longitude": 74.5891,
        "image": None,
        "tags": ["base camp", "high altitude", "nanga parbat", "challenging"],
        "isFeatured": True,
        "isPopular": False,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Naltar Valley Trek",
        "location": "Naltar, Gilgit-Baltistan",
        "description": "A beautiful moderate trek through the Naltar Valley, famous for its colourful lakes and lush pine forests. Popular among nature lovers and photographers.",
        "distance": 11.2,
        "duration": 240,
        "difficulty": "Moderate",
        "elevation": 2900.0,
        "latitude": 36.1667,
        "longitude": 74.1833,
        "image": None,
        "tags": ["lakes", "pine forest", "valley", "photography"],
        "isFeatured": True,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Deosai Plains Traverse",
        "location": "Deosai National Park, Gilgit-Baltistan",
        "description": "Trek across the world's second highest plateau at over 4000m. Deosai is home to Himalayan brown bears, wildflowers, and stunning open skies.",
        "distance": 18.0,
        "duration": 360,
        "difficulty": "Moderate",
        "elevation": 4114.0,
        "latitude": 34.9667,
        "longitude": 75.5500,
        "image": None,
        "tags": ["plateau", "wildlife", "brown bear", "wildflowers"],
        "isFeatured": False,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Ratti Gali Lake Trail",
        "location": "Neelum Valley, Azad Kashmir",
        "description": "A stunning trek leading to the turquoise Ratti Gali Lake, surrounded by snow-capped peaks. One of the most beautiful alpine lakes in Azad Kashmir.",
        "distance": 9.5,
        "duration": 210,
        "difficulty": "Moderate",
        "elevation": 3700.0,
        "latitude": 34.7200,
        "longitude": 73.9500,
        "image": None,
        "tags": ["lake", "alpine", "turquoise", "azad kashmir"],
        "isFeatured": True,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Makra Peak Summit",
        "location": "Kaghan Valley, KPK",
        "description": "A hard but rewarding summit trek in Kaghan Valley. Makra Peak offers 360-degree panoramic views of the surrounding Himalayan ranges and valleys below.",
        "distance": 13.0,
        "duration": 300,
        "difficulty": "Hard",
        "elevation": 3885.0,
        "latitude": 34.7833,
        "longitude": 73.5500,
        "image": None,
        "tags": ["summit", "peak", "panoramic", "kaghan"],
        "isFeatured": False,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Chitta Katha Lake",
        "location": "Neelum Valley, Azad Kashmir",
        "description": "Trek to Chitta Katha, a high-altitude glacial lake nestled among rocky peaks. The crystal-clear water reflecting surrounding mountains makes it a photographer's paradise.",
        "distance": 7.8,
        "duration": 180,
        "difficulty": "Moderate",
        "elevation": 4100.0,
        "latitude": 34.6800,
        "longitude": 73.9800,
        "image": None,
        "tags": ["glacial lake", "photography", "high altitude", "azad kashmir"],
        "isFeatured": True,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Margalla Hills Trail 5",
        "location": "Islamabad Capital Territory",
        "description": "The most popular trail in the Margalla Hills National Park, right next to Islamabad. Great for beginners and morning walkers with a well-marked path through dense sub-tropical forest.",
        "distance": 4.2,
        "duration": 90,
        "difficulty": "Easy",
        "elevation": 320.0,
        "latitude": 33.7500,
        "longitude": 73.0667,
        "image": None,
        "tags": ["beginner", "islamabad", "forest", "morning walk"],
        "isFeatured": False,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Rush Lake Trek",
        "location": "Hunza Valley, Gilgit-Baltistan",
        "description": "Trek to Rush Lake, the highest lake in Pakistan at 4694m. The trail offers spectacular views of Rakaposhi and Diran peaks on the way up.",
        "distance": 16.0,
        "duration": 420,
        "difficulty": "Hard",
        "elevation": 4694.0,
        "latitude": 36.0500,
        "longitude": 74.7167,
        "image": None,
        "tags": ["highest lake", "hunza", "rakaposhi", "challenging"],
        "isFeatured": True,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Shounter Lake Trail",
        "location": "Shounter Valley, Azad Kashmir",
        "description": "A hidden gem in Azad Kashmir leading to the serene Shounter Lake. The trail passes through lush green valleys and small traditional villages.",
        "distance": 10.5,
        "duration": 240,
        "difficulty": "Moderate",
        "elevation": 3500.0,
        "latitude": 34.9167,
        "longitude": 74.0833,
        "image": None,
        "tags": ["hidden gem", "village", "valley", "serene"],
        "isFeatured": False,
        "isPopular": False,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "Paye Meadows to Shogran",
        "location": "Kaghan Valley, KPK",
        "description": "A scenic connecting trek between Paye Meadows and Shogran through rolling green hills. One of the most accessible beautiful treks in KPK for families.",
        "distance": 8.0,
        "duration": 180,
        "difficulty": "Easy",
        "elevation": 2700.0,
        "latitude": 34.6167,
        "longitude": 73.4500,
        "image": None,
        "tags": ["family friendly", "meadows", "easy", "kaghan"],
        "isFeatured": True,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "name": "K2 Base Camp Trek",
        "location": "Baltoro Glacier, Gilgit-Baltistan",
        "description": "The legendary trek to the base camp of K2, the world's second highest mountain. Passing through the Baltoro Glacier with views of Broad Peak and the Gasherbrums.",
        "distance": 32.0,
        "duration": 600,
        "difficulty": "Hard",
        "elevation": 5100.0,
        "latitude": 35.8800,
        "longitude": 76.5100,
        "image": None,
        "tags": ["legendary", "k2", "glacier", "extreme"],
        "isFeatured": True,
        "isPopular": True,
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.utcnow(),
    },
]


# ── Seed function ─────────────────────────────────────────────────────────────
async def seed():
    print("\n🏔️  HikePlanner Trail Seeder")
    print("=" * 40)

    inserted = 0
    skipped = 0

    for trail in TRAILS:
        existing = await trails_collection.find_one({"name": trail["name"]})
        if existing:
            print(f"  ⏭️  SKIP  — '{trail['name']}' already exists")
            skipped += 1
        else:
            await trails_collection.insert_one(trail)
            print(f"  ✅ ADDED — '{trail['name']}'")
            inserted += 1

    print("=" * 40)
    print(f"  Done! {inserted} trails added, {skipped} skipped.")
    print("=" * 40)

    client.close()


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    asyncio.run(seed())