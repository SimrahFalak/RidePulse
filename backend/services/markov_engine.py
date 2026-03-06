import numpy as np

# All 6 possible system states
STATES = [
    "S0_Normal",
    "S1_HighDemand", 
    "S2_DriverShortage",
    "S3_Surge",
    "S4_LongWait",
    "S5_Cancellations"
]

# Transition Matrix - each row = current state, each column = next state
# Numbers = probability of moving from one state to another
# Each ROW must add up to 1.0
DEFAULT_MATRIX = np.array([
#   S0    S1    S2    S3    S4    S5
  [0.60, 0.30, 0.05, 0.02, 0.02, 0.01],  # from S0 Normal
  [0.20, 0.40, 0.25, 0.10, 0.04, 0.01],  # from S1 HighDemand
  [0.05, 0.15, 0.40, 0.25, 0.10, 0.05],  # from S2 DriverShortage
  [0.10, 0.20, 0.20, 0.30, 0.10, 0.10],  # from S3 Surge
  [0.05, 0.10, 0.15, 0.20, 0.30, 0.20],  # from S4 LongWait
  [0.10, 0.10, 0.10, 0.10, 0.20, 0.40],  # from S5 Cancellations
])

class MarkovEngine:
    def __init__(self, scenario_type: str = "normal"):
        self.matrix = DEFAULT_MATRIX.copy()
        self.current_index = 0  # start at S0 (Normal)
        self.adjust_for_scenario(scenario_type)

    def adjust_for_scenario(self, scenario_type: str):
        """Change transition probabilities based on scenario"""
        if scenario_type == "heavy_rain":
            # Rain = more likely to go from Normal → HighDemand
            self.matrix[0] = [0.20, 0.55, 0.12, 0.05, 0.05, 0.03]
        elif scenario_type == "concert":
            # Concert = extreme demand spike
            self.matrix[0] = [0.10, 0.60, 0.15, 0.08, 0.05, 0.02]
        elif scenario_type == "cricket":
            # Similar to concert but bigger
            self.matrix[0] = [0.05, 0.65, 0.15, 0.08, 0.05, 0.02]
        elif scenario_type == "driver_bonus":
            # Bonus = more drivers = easier to stay Normal
            self.matrix[2] = [0.40, 0.25, 0.20, 0.08, 0.05, 0.02]

    def next_state(self) -> str:
        """Move to next state based on probabilities"""
        probabilities = self.matrix[self.current_index]
        self.current_index = np.random.choice(len(STATES), p=probabilities)
        return STATES[self.current_index]

    def current_state(self) -> str:
        return STATES[self.current_index]