import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CarFront, Clock3, Gauge, ShieldCheck, Users, Zap } from "lucide-react";
import { useSimulationData } from "../hooks/useSimulationData";
import { STATE_COLORS, toPercent, toStateLabel } from "../lib/simulation";

function formatMinuteLabel(minute: number): string {
  return `${String(minute).padStart(2, "0")}:00`;
}

function buildDemandSupplyData(
  timeline: Array<{ minute: number; demand: number; supply: number }>,
  duration?: number,
) {
  const shouldAggregate = Boolean(duration && duration > 50 && duration % 10 === 0);

  if (!shouldAggregate) {
    return timeline.map((point) => ({
      time: formatMinuteLabel(point.minute),
      demand: point.demand,
      supply: point.supply,
    }));
  }

  const bucketSize = 10;
  const aggregated = [];

  for (let start = 0; start < timeline.length; start += bucketSize) {
    const bucket = timeline.slice(start, start + bucketSize);
    if (bucket.length === 0) {
      continue;
    }

    const demand = bucket.reduce((sum, point) => sum + point.demand, 0);
    const supply = bucket.reduce((sum, point) => sum + point.supply, 0);
    const bucketStart = bucket[0].minute;
    const bucketEnd = bucket[bucket.length - 1].minute;

    aggregated.push({
      time: `${String(bucketStart).padStart(2, "0")}-${String(bucketEnd).padStart(2, "0")}`,
      demand,
      supply,
    });
  }

  return aggregated;
}

export function Dashboard() {
  const { data, loading, error } = useSimulationData();

  if (loading) {
    return <div className="p-8 text-gray-600">Loading latest simulation...</div>;
  }

  if (error || !data?.result) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Unable to load dashboard data:</strong> {error || "Missing simulation result."}
        </div>
      </div>
    );
  }

  const simInput = data.simulation;
  const simResult = data.result;
  const timeline = simResult.time_series_json || [];
  const finalStateKey = timeline.length > 0 ? timeline[timeline.length - 1].state : "S0_Normal";

  const kpis = [
    {
      label: "Total Ride Requests",
      value: simResult.total_ride_requests.toLocaleString(),
      unit: "",
      icon: CarFront,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-700",
      accent: "#38bdf8",
    },
    {
      label: "Total Drivers",
      value: (simResult.total_drivers ?? simResult.active_drivers).toLocaleString(),
      unit: "",
      icon: Users,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-700",
      accent: "#8b5cf6",
    },
    {
      label: "Surge Probability",
      value: simResult.surge_probability.toFixed(2),
      unit: "%",
      icon: Zap,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      accent: "#f59e0b",
    },
    {
      label: "Avg Waiting Time",
      value: simResult.avg_wait_time.toFixed(2),
      unit: "min",
      icon: Clock3,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-700",
      accent: "#fb7185",
    },
    {
      label: "Driver Utilization",
      value: simResult.driver_utilization.toFixed(2),
      unit: "%",
      icon: Gauge,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      accent: "#34d399",
    },
    {
      label: "System Stability Index",
      value: simResult.stability_score.toFixed(1),
      unit: "/100",
      icon: ShieldCheck,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-700",
      accent: "#22d3ee",
    },
  ];

  const demandSupplyData = buildDemandSupplyData(timeline, simInput?.duration);

  const stateData = Object.entries(simResult.state_distribution_json || {}).map(([state, probability]) => ({
    name: toStateLabel(state),
    value: toPercent(probability),
    color: STATE_COLORS[state] || "#9ca3af",
  }));

  return (
    <div className="p-8 space-y-8">
    

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;

          return (
            <div
              key={index}
              className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{kpi.label}</p>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    {kpi.value}
                    {kpi.unit && <span className="ml-1 text-lg text-slate-500">{kpi.unit}</span>}
                  </p>
                </div>
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] ${kpi.iconBg}`}>
                  <Icon className={`h-6 w-6 ${kpi.iconColor}`} />
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, 42 + index * 9)}%`,
                    backgroundColor: kpi.accent,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Demand vs Supply Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demandSupplyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9ca3af" interval="preserveStartEnd" minTickGap={28} />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">State Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#10b981"
                dataKey="value"
              >
                {stateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

   

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Recent Simulation Summary</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Ride Arrival Rate (λ_r)</p>
            <p className="text-xl font-semibold text-gray-900">{simInput?.lambda_r ?? "-"}/min</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Driver Service Rate (λ_d)</p>
            <p className="text-xl font-semibold text-gray-900">{simInput?.lambda_d ?? "-"}/min</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Duration</p>
            <p className="text-xl font-semibold text-gray-900">{simInput?.duration ?? "-"} min</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Final State</p>
            <p className="text-xl font-semibold text-green-600">{toStateLabel(finalStateKey)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
