import numpy as np

class PoissonEngine:
    def __init__(self, base_lambda: float, multiplier: float = 1.0):
        # lambda = average requests per minute
        # multiplier = scenario boost (rain = 2.8x more requests)
        self.lam = base_lambda * multiplier
        print(f"Poisson Engine ready. Expected {self.lam} requests/min")

    def generate_arrivals(self, duration_minutes: int) -> list:
        """
        For each minute, randomly generate how many ride requests come in.
        Poisson distribution means sometimes 0, sometimes 5, avg is self.lam
        """
        arrivals = []
        for minute in range(duration_minutes):
            # numpy picks a random number based on our average rate
            requests = int(np.random.poisson(self.lam))
            arrivals.append({
                "minute": minute,
                "requests": requests
            })
        return arrivals