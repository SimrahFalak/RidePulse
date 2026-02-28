import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function Results() {
  // Transition matrix data
  const transitionMatrix = [
    { state: "Balanced", balanced: 0.65, highDemand: 0.20, shortage: 0.10, surge: 0.03, degradation: 0.02 },
    { state: "High Demand", balanced: 0.25, highDemand: 0.45, shortage: 0.15, surge: 0.12, degradation: 0.03 },
    { state: "Shortage", balanced: 0.15, highDemand: 0.20, shortage: 0.40, surge: 0.15, degradation: 0.10 },
    { state: "Surge", balanced: 0.10, highDemand: 0.25, shortage: 0.20, surge: 0.35, degradation: 0.10 },
    { state: "Degradation", balanced: 0.05, highDemand: 0.10, shortage: 0.25, surge: 0.15, degradation: 0.45 },
  ];

  // Steady-state probabilities
  const steadyState = [
    { state: "Balanced", probability: 45 },
    { state: "High Demand", probability: 25 },
    { state: "Shortage", probability: 15 },
    { state: "Surge", probability: 10 },
    { state: "Degradation", probability: 5 },
  ];

  // Performance metrics
  const metrics = [
    { label: "Average Queue Length", value: "3.4", unit: "requests" },
    { label: "Average Waiting Time", value: "4.2", unit: "minutes" },
    { label: "Surge Frequency", value: "12.5", unit: "%" },
    { label: "Driver Utilization Rate", value: "78.3", unit: "%" },
  ];

  // Convergence data
  const convergenceData = [
    { iteration: 0, balanced: 0.2, highDemand: 0.2, shortage: 0.2, surge: 0.2, degradation: 0.2 },
    { iteration: 200, balanced: 0.35, highDemand: 0.25, shortage: 0.18, surge: 0.15, degradation: 0.07 },
    { iteration: 400, balanced: 0.42, highDemand: 0.25, shortage: 0.16, surge: 0.11, degradation: 0.06 },
    { iteration: 600, balanced: 0.44, highDemand: 0.25, shortage: 0.15, surge: 0.10, degradation: 0.06 },
    { iteration: 800, balanced: 0.45, highDemand: 0.25, shortage: 0.15, surge: 0.10, degradation: 0.05 },
    { iteration: 1000, balanced: 0.45, highDemand: 0.25, shortage: 0.15, surge: 0.10, degradation: 0.05 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Transition Matrix */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Transition Probability Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-3 font-semibold text-gray-900">From / To</th>
                <th className="text-center p-3 font-semibold text-gray-900">Balanced</th>
                <th className="text-center p-3 font-semibold text-gray-900">High Demand</th>
                <th className="text-center p-3 font-semibold text-gray-900">Shortage</th>
                <th className="text-center p-3 font-semibold text-gray-900">Surge</th>
                <th className="text-center p-3 font-semibold text-gray-900">Degradation</th>
              </tr>
            </thead>
            <tbody>
              {transitionMatrix.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{row.state}</td>
                  <td className="text-center p-3 text-gray-700">{row.balanced.toFixed(2)}</td>
                  <td className="text-center p-3 text-gray-700">{row.highDemand.toFixed(2)}</td>
                  <td className="text-center p-3 text-gray-700">{row.shortage.toFixed(2)}</td>
                  <td className="text-center p-3 text-gray-700">{row.surge.toFixed(2)}</td>
                  <td className="text-center p-3 text-gray-700">{row.degradation.toFixed(2)}</td>
                </tr>
              ))}
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
                <span className="font-medium text-gray-900">{state.state}</span>
                <span className="text-gray-600">{state.probability}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${state.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Markov Chain Graph */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Markov Chain State Diagram</h3>
        <div className="relative w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          {/* Simplified node visualization */}
          <div className="relative w-full h-full p-8">
            {/* Center node */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm text-center shadow-lg">
              Balanced
            </div>
            
            {/* Top node */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm text-center shadow-lg">
              High<br/>Demand
            </div>
            
            {/* Right node */}
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm text-center shadow-lg">
              Shortage
            </div>
            
            {/* Bottom right node */}
            <div className="absolute bottom-8 right-20 w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm text-center shadow-lg">
              Surge
            </div>
            
            {/* Bottom left node */}
            <div className="absolute bottom-8 left-20 w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm text-center shadow-lg">
              Degradation
            </div>

            {/* Arrows (simplified with SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                </marker>
              </defs>
              {/* Sample arrows */}
              <line x1="50%" y1="30%" x2="50%" y2="45%" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="55%" y1="50%" x2="70%" y2="50%" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-4 gap-6">
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
            <XAxis dataKey="iteration" stroke="#9ca3af" label={{ value: 'Iterations', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="#9ca3af" label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="balanced" stroke="#10b981" strokeWidth={2} name="Balanced" />
            <Line type="monotone" dataKey="highDemand" stroke="#3b82f6" strokeWidth={2} name="High Demand" />
            <Line type="monotone" dataKey="shortage" stroke="#f59e0b" strokeWidth={2} name="Shortage" />
            <Line type="monotone" dataKey="surge" stroke="#ef4444" strokeWidth={2} name="Surge" />
            <Line type="monotone" dataKey="degradation" stroke="#6b7280" strokeWidth={2} name="Degradation" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
