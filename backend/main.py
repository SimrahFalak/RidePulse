from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.mongo import connect_db, close_db
from routers import scenarios, simulation, analytics

# New way to handle startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()   # runs on startup
    yield
    await close_db()     # runs on shutdown

app = FastAPI(
    title="🚗 Ride Surge Prediction API",
    description="Predicts ride-hailing surge using Poisson + Markov Chain",
    version="1.0.0",
    lifespan=lifespan    # attach it here
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(scenarios.router, prefix="/api/scenarios", tags=["Scenarios"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["Simulation"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
async def root():
    return {"message": "🚗 Ride Surge API is running!"}