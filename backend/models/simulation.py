from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Table 1 - INPUT (what frontend sends)
class SimulationInput(BaseModel):
    scenario_type: str        # "Normal Day", "Rain" etc
    lambda_r: float           # ride request rate
    lambda_d: float           # driver availability rate
    surge_threshold: int      # e.g. 80 (means 80%)
    duration: int             # minutes
    iterations: int           # how many times to run

# Table 2 - OUTPUT (what gets saved after simulation)
class SimulationResult(BaseModel):
    simulation_id: str                    # links to simulation input
    avg_wait_time: float
    avg_queue_length: float
    surge_probability: float
    driver_utilization: float
    stability_score: float
    total_ride_requests: int
    active_drivers: int
    steady_state_json: Dict               # steady state probabilities
    transition_matrix_json: List[List]    # 6x6 markov matrix
    time_series_json: List[Dict]          # minute by minute data
    state_distribution_json: Dict         # time spent in each state