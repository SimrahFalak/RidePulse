
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSimulationData } from "../hooks/useSimulationData";
import { STATE_COLORS, toPercent, toStateLabel } from "../lib/simulation";

export function Results() {
  const { data, loading, error } = useSimulationData();

  if (loading) {
    return <div className="p-8 text-gray-600">Loading simulation results...</div>;
  }

  if (error || !data?.result) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Unable to load results:</strong> {error || "Missing simulation result."}
        </div>
      </div>
    );
  }

  const simResult = data.result;
  const timeline = simResult.time_series_json || [];

  const stateKeys = Object.keys(simResult.steady_state_json || {});

  const steadyState = stateKeys.map((state) => ({
    state,
    label: toStateLabel(state),
    probability: toPercent(simResult.steady_state_json[state] || 0),
    color: STATE_COLORS[state] || "#9ca3af",
  }));

  const transitionRows = (simResult.transition_matrix_json || []).map((row, rowIndex) => {
    const fromState = stateKeys[rowIndex] || `State ${rowIndex + 1}`;
    const values = stateKeys.map((_, colIndex) => row[colIndex] ?? 0);
    return { fromState, values };
  });

  const matrixRowBackgrounds = [
    "#dff8ef",
    "#e0edff",
    "#fff4d6",
    "#ffe1e7",
    "#e7e9ee",
    "#ece5ff",
  ];

  const anchors = [
    { x: 50, y: 18 },
    { x: 50, y: 58 },
    { x: 84, y: 50 },
    { x: 22, y: 80 },
    { x: 76, y: 80 },
    { x: 30, y: 34 },
  ];

  const diagramStates = steadyState.map((state, index) => {
    const anchor = anchors[index % anchors.length];
    const size = Math.max(110, Math.min(150, 100 + state.probability * 2));

    return {
      ...state,
      left: anchor.x,
      top: anchor.y,
      size,
    };
  });

  const metrics = [
    { label: "Average Queue Length", value: simResult.avg_queue_length.toFixed(2), unit: "requests" },
    { label: "Average Waiting Time", value: simResult.avg_wait_time.toFixed(2), unit: "minutes" },
    { label: "Surge Frequency", value: simResult.surge_probability.toFixed(2), unit: "%" },
    { label: "Driver Utilization Rate", value: simResult.driver_utilization.toFixed(2), unit: "%" },
  ];

  const runningCounts: Record<string, number> = {};
  stateKeys.forEach((state) => {
    runningCounts[state] = 0;
  });

  const convergenceData = timeline.map((point, index) => {
    runningCounts[point.state] = (runningCounts[point.state] || 0) + 1;
    const snapshot: Record<string, number> = {
      iteration: point.minute,
    };

    stateKeys.forEach((state) => {
      snapshot[state] = Number((runningCounts[state] / (index + 1)).toFixed(4));
    });

    return snapshot;
  });

  return (
    <div className="p-8 space-y-8">
      {/* Transition Matrix */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Transition Probability Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left p-3 font-semibold text-gray-900">From / To</th>
                {stateKeys.map((state) => (
                  <th key={state} className="text-center p-3 font-semibold text-gray-900 whitespace-nowrap">
                    {toStateLabel(state)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transitionRows.map((row, idx) => {
                const rowColor = matrixRowBackgrounds[idx % matrixRowBackgrounds.length];

                return (
                  <tr key={idx} style={{ backgroundColor: rowColor }}>
                    <td className="p-3 font-medium text-gray-900 whitespace-nowrap rounded-l-lg">{toStateLabel(row.fromState)}</td>
                    {row.values.map((value, colIdx) => (
                      <td
                        key={colIdx}
                        className={`text-center p-3 text-gray-700 ${
                          colIdx === row.values.length - 1 ? "rounded-r-lg" : ""
                        }`}
                      >
                        {value.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Steady-State Probability */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Steady-State Probability Distribution</h3>
        <div className="space-y-3">
          {steadyState.map((state, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">{state.label}</span>
                <span className="text-gray-600">{state.probability}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: state.color,
                    width: `${state.probability}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Markov Chain Graph */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Markov Chain State Diagram</h3>
        <div className="w-full min-h-[420px] rounded-xl bg-gray-100 border border-gray-200 relative overflow-hidden">
          {diagramStates.map((state, index) => (
            <div
              key={state.state}
              className="markov-bubble absolute rounded-full flex flex-col items-center justify-center text-white text-center font-semibold shadow-xl"
              style={{
                width: `${state.size}px`,
                height: `${state.size}px`,
                left: `${state.left}%`,
                top: `${state.top}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: state.color,
                animationDelay: `${index * 120}ms, ${700 + index * 120}ms`,
                animationDuration: `${560 + index * 80}ms, ${5400 + index * 320}ms`,
              }}
            >
              <span className="px-2 text-[11px] sm:text-sm leading-tight">{state.label}</span>
              <span className="text-[11px] sm:text-sm opacity-95">{state.probability}%</span>
            </div>
          ))}
          <div className="absolute left-3 bottom-3 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded-md">
            Bubble size and label value are based on steady-state probability.
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-2">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-900">
              {metric.value}
              <span className="text-lg text-gray-500 ml-1">{metric.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Convergence Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Steady-State Convergence</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={convergenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="iteration"
              stroke="#9ca3af"
              label={{ value: "Minute", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              stroke="#9ca3af"
              domain={[0, 1]}
              label={{ value: "Probability", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            {stateKeys.map((state) => (
              <Line
                key={state}
                type="monotone"
                dataKey={state}
                stroke={STATE_COLORS[state] || "#9ca3af"}
                strokeWidth={2}
                name={toStateLabel(state)}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
