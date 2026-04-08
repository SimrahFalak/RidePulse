from services.poisson_engine import PoissonEngine
from services.markov_engine import MarkovEngine, STATES, DEFAULT_MATRIX
from services.alert_engine import AlertEngine
from datetime import datetime
import numpy as np

class SimulationRunner:
    def __init__(self, sim_input: dict):
        self.input = sim_input
        self.poisson = PoissonEngine(
            base_lambda=sim_input["lambda_r"],
            multiplier=1.0
        )
        self.markov = MarkovEngine(scenario_type=sim_input.get("scenario_type", "normal"))
        self.alert_engine = AlertEngine()

    def calculate_steady_state(self) -> dict:
        """
        Steady state = long run probability of being in each state
        Solve: π = π * P  (left eigenvector)
        """
        matrix = self.markov.matrix
        # Get eigenvectors
        eigenvalues, eigenvectors = np.linalg.eig(matrix.T)
        # Find eigenvector for eigenvalue = 1
        steady = eigenvectors[:, np.isclose(eigenvalues, 1)].real[:, 0]
        steady = steady / steady.sum()  # normalize to sum = 1
        return {STATES[i]: round(float(steady[i]), 4) for i in range(len(STATES))}

    def run(self, simulation_id: str) -> dict:
        duration = self.input["duration"]
        # lambda_d is treated as per-minute service capacity
        base_supply = max(1, int(round(self.input["lambda_d"])))
        total_drivers = max(base_supply, int(round(self.input["lambda_d"] * 100)))
        surge_threshold = self.input["surge_threshold"]
        iterations = self.input["iterations"]

        # Run multiple iterations and average results
        all_results = []
        for _ in range(iterations):
            all_results.append(self._single_run(duration, base_supply, total_drivers, surge_threshold))

        # Average across all iterations
        avg_wait = round(sum(r["total_wait"] for r in all_results) / iterations, 2)
        avg_queue = round(sum(r["avg_queue"] for r in all_results) / iterations, 2)
        surge_prob = round(sum(r["surge_rate"] for r in all_results) / iterations, 2)
        total_requests = int(sum(r["total_requests"] for r in all_results) / iterations)
        utilization = round(sum(r["utilization"] for r in all_results) / iterations, 2)

        # Use last iteration's time series for visualization
        last_run = all_results[-1]

        # Stability score (0-100, higher = more stable)
        stability = round(100 - (surge_prob * 0.4) - (avg_wait * 2) - (avg_queue * 0.5), 1)
        stability = max(0, min(100, stability))

        return {
            "simulation_id": simulation_id,
            "avg_wait_time": avg_wait,
            "avg_queue_length": avg_queue,
            "surge_probability": surge_prob,
            "driver_utilization": utilization,
            "stability_score": stability,
            "total_ride_requests": total_requests,
            "total_drivers": total_drivers,
            "active_drivers": base_supply,
            "steady_state_json": self.calculate_steady_state(),
            "transition_matrix_json": self.markov.matrix.tolist(),
            "time_series_json": last_run["timeline"],
            "state_distribution_json": last_run["state_distribution"]
        }

    def _single_run(self, duration, base_supply, total_drivers, surge_threshold) -> dict:
        """One complete simulation run"""
        arrivals = self.poisson.generate_arrivals(duration)
        pending = 0
        total_wait = 0
        total_requests = 0
        total_queue = 0
        surge_minutes = 0
        state_counts = {s: 0 for s in STATES}
        timeline = []

        # Reset markov to start state
        self.markov.current_index = 0

        for entry in arrivals:
            minute = entry["minute"]
            new_req = entry["requests"]
            total_requests += new_req
            pending += new_req

            available_supply = max(1, min(total_drivers, int(np.random.poisson(base_supply))))

            # Measure pressure before dispatching drivers this minute.
            demand_ratio = round(pending / max(available_supply, 1), 2)
            surge_now = demand_ratio * 100 >= surge_threshold
            if surge_now:
                surge_minutes += 1

            served = min(available_supply, pending)
            pending = max(0, pending - served)

            wait_time = round((pending / max(available_supply, 0.1)) * 5, 2)
            utilization = round((served / max(available_supply, 1)) * 100, 1)

            state = self.markov.next_state()
            state_counts[state] += 1

            # Cancellations
            if wait_time > 8:
                cancelled = int(pending * 0.3)
                pending = max(0, pending - cancelled)

            surge_mult = round(1.5 + demand_ratio * 0.3, 2) if surge_now else 1.0
            total_wait += wait_time
            total_queue += pending

            timeline.append({
                "minute": minute,
                "demand": new_req,
                "supply": available_supply,
                "queue": pending,
                "state": state,
                "wait_time": wait_time,
                "surge_multiplier": surge_mult,
                "utilization": utilization
            })

        return {
            "total_wait": round(total_wait / duration, 2),
            "avg_queue": round(total_queue / duration, 2),
            "surge_rate": round((surge_minutes / max(duration, 1)) * 100, 2),
            "total_requests": total_requests,
            "utilization": round((total_requests - pending) / max(total_requests, 1) * 100, 1),
            "timeline": timeline,
            "state_distribution": {
                s: round(state_counts[s] / duration, 3) for s in STATES
            }
        }