from pydantic import BaseModel
from typing import Optional

class ScenarioCreate(BaseModel):
    name: str
    type: str
    description: str
    lambda_base: float        # base requests per minute (e.g. 2.0)
    lambda_multiplier: float  # how much demand increases (e.g. 2.8 for rain)
    driver_availability: float  # 0.0 to 1.0 (1.0 = all drivers available)
    duration_minutes: int     # how long to simulate

class ScenarioResponse(ScenarioCreate):
    id: str