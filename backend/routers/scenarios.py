from fastapi import APIRouter
from db.mongo import get_db
from bson import ObjectId

router = APIRouter()

# ✅ GET all scenarios
@router.get("/")
async def get_scenarios():
    db = get_db()
    scenarios = await db["scenarios"].find().to_list(100)
    for s in scenarios:
        s["id"] = str(s["_id"])
        del s["_id"]
    return scenarios

# ✅ GET one scenario by ID
@router.get("/{scenario_id}")
async def get_scenario(scenario_id: str):
    db = get_db()
    scenario = await db["scenarios"].find_one({"_id": ObjectId(scenario_id)})
    if not scenario:
        return {"error": "Not found"}
    scenario["id"] = str(scenario["_id"])
    del scenario["_id"]
    return scenario

# ✅ POST - Create custom scenario
@router.post("/")
async def create_scenario(data: dict):
    db = get_db()
    result = await db["scenarios"].insert_one(data)
    return {"id": str(result.inserted_id), "message": "Scenario created!"}

# ✅ POST - Seed default scenarios (run once at start)
@router.post("/seed/defaults")
async def seed_scenarios():
    db = get_db()
    
    defaults = [
        {
            "name": "Normal Day ☀️",
            "type": "normal",
            "description": "Regular day, balanced supply and demand",
            "lambda_base": 2.0,
            "lambda_multiplier": 1.0,
            "driver_availability": 0.9,
            "duration_minutes": 60
        },
        {
            "name": "Heavy Rain 🌧️",
            "type": "heavy_rain",
            "description": "Rain causes massive demand spike",
            "lambda_base": 2.0,
            "lambda_multiplier": 2.8,
            "driver_availability": 0.6,
            "duration_minutes": 60
        },
        {
            "name": "Concert Ending 🎤",
            "type": "concert",
            "description": "Big concert just ended, everyone needs rides",
            "lambda_base": 2.0,
            "lambda_multiplier": 5.0,
            "driver_availability": 0.7,
            "duration_minutes": 30
        },
        {
            "name": "Cricket Match 🏏",
            "type": "cricket",
            "description": "Match just ended at stadium",
            "lambda_base": 2.0,
            "lambda_multiplier": 6.0,
            "driver_availability": 0.65,
            "duration_minutes": 45
        },
        {
            "name": "Driver Bonus 💰",
            "type": "driver_bonus",
            "description": "Bonus announced, more drivers come online",
            "lambda_base": 2.0,
            "lambda_multiplier": 1.2,
            "driver_availability": 1.0,
            "duration_minutes": 60
        },
        {
            "name": "New Year's Eve 🎆",
            "type": "concert",
            "description": "Massive demand on new year midnight",
            "lambda_base": 2.0,
            "lambda_multiplier": 8.0,
            "driver_availability": 0.5,
            "duration_minutes": 60
        },
        {
            "name": "Morning Rush Hour 🌅",
            "type": "normal",
            "description": "Office hours morning rush",
            "lambda_base": 2.0,
            "lambda_multiplier": 1.8,
            "driver_availability": 0.75,
            "duration_minutes": 90
        },
        {
            "name": "Midnight Normal 🌙",
            "type": "normal",
            "description": "Late night, low demand",
            "lambda_base": 2.0,
            "lambda_multiplier": 0.4,
            "driver_availability": 0.3,
            "duration_minutes": 60
        },
        {
            "name": "Flood Emergency 🌊",
            "type": "heavy_rain",
            "description": "Extreme flooding, roads blocked",
            "lambda_base": 2.0,
            "lambda_multiplier": 4.0,
            "driver_availability": 0.2,
            "duration_minutes": 120
        },
        {
            "name": "PSL Final 🏏",
            "type": "cricket",
            "description": "PSL final match ending in Karachi",
            "lambda_base": 2.0,
            "lambda_multiplier": 7.5,
            "driver_availability": 0.55,
            "duration_minutes": 45
        }
    ]
    
    await db["scenarios"].insert_many(defaults)
    return {"message": f"✅ {len(defaults)} scenarios added!"}

# ✅ DELETE a scenario
@router.delete("/{scenario_id}")
async def delete_scenario(scenario_id: str):
    db = get_db()
    await db["scenarios"].delete_one({"_id": ObjectId(scenario_id)})
    return {"message": "Deleted!"}

# Delete ALL scenarios (for cleanup)
@router.delete("/all/clear")
async def clear_all_scenarios():
    db = get_db()
    result = await db["scenarios"].delete_many({})
    return {"message": f"✅ Deleted {result.deleted_count} scenarios"}