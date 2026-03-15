export type SimulationInput = {
  id?: string;
  created_at?: string;
  scenario_type: string;
  lambda_r: number;
  lambda_d: number;
  surge_threshold: number;
  duration: number;
  iterations: number;
};

export type TimelinePoint = {
  minute: number;
  demand: number;
  supply: number;
  queue: number;
  state: string;
  wait_time: number;
  surge_multiplier: number;
  utilization: number;
};

export type SimulationResult = {
  simulation_id: string;
  avg_wait_time: number;
  avg_queue_length: number;
  surge_probability: number;
  driver_utilization: number;
  stability_score: number;
  total_ride_requests: number;
  total_drivers?: number;
  active_drivers: number;
  steady_state_json: Record<string, number>;
  transition_matrix_json: number[][];
  time_series_json: TimelinePoint[];
  state_distribution_json: Record<string, number>;
};

export type FullSimulationResponse = {
  simulation: SimulationInput | null;
  result: SimulationResult | null;
};

const rawApiUrl =
  (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  "http://localhost:8000";
const API_URL = rawApiUrl.replace(/\/+$/, "");

export const LATEST_SIMULATION_ID_KEY = "ridepulse.latestSimulationId";

function buildSimulationEndpoint(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  if (API_URL.endsWith("/api")) {
    return `${API_URL}/simulation/${normalizedPath}`;
  }
  return `${API_URL}/api/simulation/${normalizedPath}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
    );
  }
  return response.json() as Promise<T>;
}

export function saveLatestSimulationId(simulationId: string): void {
  if (!simulationId) {
    return;
  }
  localStorage.setItem(LATEST_SIMULATION_ID_KEY, simulationId);
}

export function loadLatestSimulationId(): string | null {
  return localStorage.getItem(LATEST_SIMULATION_ID_KEY);
}

export async function fetchLatestSimulationId(): Promise<string | null> {
  const history = await fetchJson<Array<{ id: string }>>(buildSimulationEndpoint("history"));
  return history.length > 0 ? history[0].id : null;
}

export async function resolveSimulationId(preferredId?: string | null): Promise<string | null> {
  if (preferredId) {
    return preferredId;
  }

  const cachedId = loadLatestSimulationId();
  if (cachedId) {
    return cachedId;
  }

  const historyId = await fetchLatestSimulationId();
  if (historyId) {
    saveLatestSimulationId(historyId);
  }
  return historyId;
}

export async function fetchFullSimulation(simulationId: string): Promise<FullSimulationResponse> {
  return fetchJson<FullSimulationResponse>(buildSimulationEndpoint(`full/${simulationId}`));
}

export const STATE_LABELS: Record<string, string> = {
  S0_Normal: "Normal",
  S1_HighDemand: "High Demand",
  S2_DriverShortage: "Driver Shortage",
  S3_Surge: "Surge",
  S4_LongWait: "Long Wait",
  S5_Cancellations: "Cancellations",
};

export const STATE_COLORS: Record<string, string> = {
  S0_Normal: "#10b981",
  S1_HighDemand: "#3b82f6",
  S2_DriverShortage: "#f59e0b",
  S3_Surge: "#ef4444",
  S4_LongWait: "#6b7280",
  S5_Cancellations: "#8b5cf6",
};

export function toStateLabel(stateKey: string): string {
  return STATE_LABELS[stateKey] || stateKey;
}

export function toPercent(value: number): number {
  return Number((value * 100).toFixed(2));
}
