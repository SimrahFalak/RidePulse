from fastapi import APIRouter
from services.simulation_runner import SimulationRunner
from db.mongo import get_db
from bson import ObjectId
from datetime import datetime
from fastapi.responses import StreamingResponse
import asyncio
import csv
import io

router = APIRouter()

# ✅ Run simulation - saves to BOTH collections
@router.post("/run")
async def run_simulation(data: dict):
    db = get_db()

    sim_input = {
        "created_at": datetime.utcnow(),
        "scenario_type": data["scenario_type"],
        "lambda_r": data["lambda_r"],
        "lambda_d": data["lambda_d"],
        "surge_threshold": data.get("surge_threshold", 80),
        "duration": data.get("duration", 60),
        "iterations": data.get("iterations", 1)
    }
    inserted_sim = await db["simulations"].insert_one(sim_input)
    simulation_id = str(inserted_sim.inserted_id)

    runner = SimulationRunner(data)
    result = runner.run(simulation_id)

    # ✅ Make sure simulation_id is a plain string before saving
    result_to_save = dict(result)
    result_to_save["simulation_id"] = simulation_id  # explicitly set as string
    result_to_save.pop("_id", None)

    await db["simulation_results"].insert_one(result_to_save)

    result.pop("_id", None)
    sim_input.pop("_id", None)
    sim_input["id"] = simulation_id

    return {
        "simulation_id": simulation_id,
        "input": sim_input,
        "result": result
    }

# ✅ Get all simulations (Table 1)
@router.get("/history")
async def get_history():
    db = get_db()
    sims = await db["simulations"].find().sort("created_at", -1).to_list(50)
    for s in sims:
        s["id"] = str(s["_id"])
        del s["_id"]
    return sims

# ✅ Get result for a simulation (Table 2)
@router.get("/result/{simulation_id}")
async def get_result(simulation_id: str):
    db = get_db()
    
    # Try finding by simulation_id field (string match)
    result = await db["simulation_results"].find_one(
        {"simulation_id": simulation_id}
    )
    
    # If not found, try finding by _id directly
    if not result:
        try:
            result = await db["simulation_results"].find_one(
                {"_id": ObjectId(simulation_id)}
            )
        except:
            pass

    if not result:
        return {"error": "Result not found"}
    
    result["id"] = str(result["_id"])
    del result["_id"]
    return result

# ✅ Get both input + result together
@router.get("/full/{simulation_id}")
async def get_full(simulation_id: str):
    db = get_db()
    sim = await db["simulations"].find_one({"_id": ObjectId(simulation_id)})
    result = await db["simulation_results"].find_one({"simulation_id": simulation_id})
    if sim: sim["id"] = str(sim["_id"]); del sim["_id"]
    if result: result["id"] = str(result["_id"]); del result["_id"]
    return {"simulation": sim, "result": result}

# ✅ Export CSV
@router.get("/export/csv/{simulation_id}")
async def export_csv(simulation_id: str):
    db = get_db()
    result = await db["simulation_results"].find_one({"simulation_id": simulation_id})
    if not result:
        return {"error": "Not found"}

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        "minute", "demand", "supply", "queue",
        "state", "wait_time", "surge_multiplier", "utilization"
    ])
    writer.writeheader()
    writer.writerows(result["time_series_json"])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=simulation_{simulation_id}.csv"}
    )

# ✅ WebSocket for live simulation
@router.websocket("/live")
async def live_simulation(websocket):
    from fastapi import WebSocket
    await websocket.accept()
    data = await websocket.receive_json()

    runner = SimulationRunner(data)
    arrivals = runner.poisson.generate_arrivals(data.get("duration", 60))
    active_drivers = int(100 * data["lambda_d"])
    pending = 0

    for entry in arrivals:
        new_req = entry["requests"]
        pending += new_req
        served = min(active_drivers, pending)
        pending = max(0, pending - served)

        wait_time = round((pending / max(active_drivers, 0.1)) * 5, 2)
        state = runner.markov.next_state()

        await websocket.send_json({
            "minute": entry["minute"],
            "demand": new_req,
            "supply": active_drivers,
            "queue": pending,
            "state": state,
            "wait_time": wait_time
        })
        await asyncio.sleep(1)

    await websocket.close()
