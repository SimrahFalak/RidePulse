from fastapi import APIRouter
from db.mongo import get_db

router = APIRouter()

# ✅ Compare all simulations side by side
@router.get("/compare")
async def compare_all():
    db = get_db()
    results = await db["simulations"].find(
        {},
        {
            "scenario_name": 1,
            "surge_triggered": 1,
            "avg_wait_time": 1,
            "cancellation_rate": 1,
            "state_distribution": 1,
            "surge_start_minute": 1,
            "final_state": 1
        }
    ).to_list(100)
    
    for r in results:
        r["id"] = str(r["_id"])
        del r["_id"]
    return results

# ✅ Alert summary - how many of each alert type happened
@router.get("/alerts")
async def alert_summary():
    db = get_db()
    pipeline = [
        {"$unwind": "$alerts"},
        {"$group": {
            "_id": "$alerts.type",
            "total_count": {"$sum": 1},
            "severity": {"$first": "$alerts.severity"},
            "example_message": {"$first": "$alerts.message"}
        }},
        {"$sort": {"total_count": -1}}
    ]
    result = await db["simulations"].aggregate(pipeline).to_list(20)
    return result

# ✅ State distribution across all simulations
@router.get("/states")
async def state_stats():
    db = get_db()
    simulations = await db["simulations"].find(
        {}, {"state_distribution": 1, "scenario_name": 1}
    ).to_list(100)
    
    for s in simulations:
        s["id"] = str(s["_id"])
        del s["_id"]
    return simulations