import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ScenarioApi = {
  id: string;
  name: string;
  type: string;
  description: string;
  lambda_base: number;
  lambda_multiplier: number;
  driver_availability: number;
  duration_minutes: number;
};

const rawApiUrl =
  (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  "http://localhost:8000";
const API_URL = rawApiUrl.replace(/\/+$/, "");

const ROW_PALETTES = [
  { bg: "#dff8ef", border: "#a7f3d0", label: "#065f46" },
  { bg: "#e0edff", border: "#bfdbfe", label: "#1e3a8a" },
  { bg: "#fff4d6", border: "#fde68a", label: "#78350f" },
  { bg: "#ffe1e7", border: "#fecdd3", label: "#9f1239" },
  { bg: "#ece5ff", border: "#ddd6fe", label: "#4c1d95" },
  { bg: "#e7f5ff", border: "#bae6fd", label: "#0c4a6e" },
  { bg: "#fef3f2", border: "#fecaca", label: "#7f1d1d" },
  { bg: "#f0fdf4", border: "#bbf7d0", label: "#14532d" },
];

const SCENARIOS_ENDPOINT = API_URL.endsWith("/api")
  ? `${API_URL}/scenarios`
  : `${API_URL}/api/scenarios`;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function ScenarioComparison() {
  const [scenarios, setScenarios] = useState<ScenarioApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadScenarios = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(SCENARIOS_ENDPOINT);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
          );
        }

        const payload = (await response.json()) as ScenarioApi[];
        if (!cancelled) {
          setScenarios(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load scenarios.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadScenarios();
    return () => {
      cancelled = true;
    };
  }, []);

  const scenarioMetrics = useMemo(
    () =>
      scenarios.map((scenario) => {
        const demandIntensity = Number((scenario.lambda_base * scenario.lambda_multiplier).toFixed(2));
        const driverCoverage = Number((scenario.driver_availability * 100).toFixed(1));

        // Derived comparison metrics from scenario API fields.
        const surgeProbability = clamp(
          Number((((scenario.lambda_multiplier - 1) * 18) + ((1 - scenario.driver_availability) * 45) + 10).toFixed(1)),
          0,
          100
        );
        const avgWaitTime = Number(
          ((scenario.duration_minutes / 60) * scenario.lambda_multiplier * (1.15 - scenario.driver_availability) * 8)
            .toFixed(2)
        );
        const stabilityScore = clamp(
          Number((100 - (surgeProbability * 0.6) - ((100 - driverCoverage) * 0.3)).toFixed(1)),
          0,
          100
        );
        const driverUtilization = clamp(
          Number((((scenario.lambda_multiplier * 50) / Math.max(scenario.driver_availability, 0.2)) / 2).toFixed(1)),
          0,
          100
        );

        return {
          ...scenario,
          demandIntensity,
          driverCoverage,
          surgeProbability,
          avgWaitTime,
          stabilityScore,
          driverUtilization,
        };
      }),
    [scenarios]
  );

  const intensityComparisonData = scenarioMetrics.map((scenario) => ({
    name: scenario.name,
    demandIntensity: scenario.demandIntensity,
    driverCoverage: scenario.driverCoverage,
  }));

  const surgeData = scenarioMetrics.map((scenario) => ({
    name: scenario.name,
    surge: scenario.surgeProbability,
  }));

  const highestSurge = [...scenarioMetrics].sort((a, b) => b.surgeProbability - a.surgeProbability)[0];
  const bestStability = [...scenarioMetrics].sort((a, b) => b.stabilityScore - a.stabilityScore)[0];

  if (loading) {
    return <div className="p-8 text-gray-600">Loading scenarios...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Unable to load scenarios:</strong> {error}
        </div>
      </div>
    );
  }

  if (scenarioMetrics.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
          <strong>No scenarios found.</strong> Add scenarios from backend and reload this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Comparison Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Scenario Comparison Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left p-3 font-semibold text-gray-900">Scenario</th>
                <th className="text-center p-3 font-semibold text-gray-900">Surge Probability (%)</th>
                <th className="text-center p-3 font-semibold text-gray-900">Avg Wait Time (min)</th>
                <th className="text-center p-3 font-semibold text-gray-900">Stability Score</th>
                <th className="text-center p-3 font-semibold text-gray-900">Driver Utilization (%)</th>
              </tr>
            </thead>
            <tbody>
              {scenarioMetrics.map((scenario, idx) => {
                const palette = ROW_PALETTES[idx % ROW_PALETTES.length];
                return (
                  <tr key={idx} style={{ backgroundColor: palette.bg }}>
                    <td
                      className="p-3 font-semibold rounded-l-lg whitespace-nowrap"
                      style={{ color: palette.label }}
                    >
                      {scenario.name}
                    </td>
                    <td className="text-center p-3">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor:
                            scenario.surgeProbability > 35
                              ? "#fee2e2"
                              : scenario.surgeProbability > 20
                              ? "#ffedd5"
                              : "#dcfce7",
                          color:
                            scenario.surgeProbability > 35
                              ? "#b91c1c"
                              : scenario.surgeProbability > 20
                              ? "#c2410c"
                              : "#15803d",
                        }}
                      >
                        {scenario.surgeProbability}%
                      </span>
                    </td>
                    <td className="text-center p-3 text-gray-700">{scenario.avgWaitTime.toFixed(2)}</td>
                    <td className="text-center p-3 text-gray-700">{scenario.stabilityScore.toFixed(1)}</td>
                    <td className="text-center p-3 text-gray-700 rounded-r-lg">{scenario.driverUtilization}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>



      {/* Bar Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Surge Probability Comparison</h3>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={surgeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: 'Surge Probability (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="surge" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    
    </div>
  );
}
