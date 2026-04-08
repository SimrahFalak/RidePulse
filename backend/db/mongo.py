from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, DB_NAME
import certifi

client = None
db = None

async def connect_db():
    global client, db

    client = AsyncIOMotorClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where()
    )

    db = client[DB_NAME]

    print("✅ Connected to MongoDB!")

async def close_db():
    client.close()
    print("❌ MongoDB connection closed")

def get_db():
    return db