import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function ScenarioComparison() {
  // Comparison table data
  const scenarios = [
    { name: "Normal Day", surgeProbability: 12, avgWaitTime: 3.8, stabilityScore: 0.89, driverUtilization: 72 },
    { name: "Rain Event", surgeProbability: 28, avgWaitTime: 6.2, stabilityScore: 0.72, driverUtilization: 85 },
    { name: "Concert Event", surgeProbability: 35, avgWaitTime: 8.5, stabilityScore: 0.65, driverUtilization: 92 },
    { name: "Festival", surgeProbability: 42, avgWaitTime: 11.2, stabilityScore: 0.58, driverUtilization: 96 },
    { name: "Holiday Season", surgeProbability: 25, avgWaitTime: 5.5, stabilityScore: 0.78, driverUtilization: 88 },
  ];

  // Multi-line chart data
  const timeSeriesData = [
    { time: "00:00", normal: 10, rain: 15, concert: 20, festival: 25 },
    { time: "04:00", normal: 8, rain: 12, concert: 15, festival: 18 },
    { time: "08:00", normal: 15, rain: 25, concert: 30, festival: 35 },
    { time: "12:00", normal: 12, rain: 22, concert: 28, festival: 32 },
    { time: "16:00", normal: 14, rain: 24, concert: 32, festival: 38 },
    { time: "20:00", normal: 18, rain: 35, concert: 45, festival: 52 },
    { time: "24:00", normal: 11, rain: 18, concert: 22, festival: 28 },
  ];

  // Bar chart data for surge probability
  const surgeData = scenarios.map(s => ({
    name: s.name,
    surge: s.surgeProbability,
  }));

  return (
    <div className="p-8 space-y-8">
      {/* Comparison Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Scenario Comparison Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-3 font-semibold text-gray-900">Scenario</th>
                <th className="text-center p-3 font-semibold text-gray-900">Surge Probability (%)</th>
                <th className="text-center p-3 font-semibold text-gray-900">Avg Wait Time (min)</th>
                <th className="text-center p-3 font-semibold text-gray-900">Stability Score</th>
                <th className="text-center p-3 font-semibold text-gray-900">Driver Utilization (%)</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{scenario.name}</td>
                  <td className="text-center p-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      scenario.surgeProbability > 35 ? "bg-red-100 text-red-700" :
                      scenario.surgeProbability > 20 ? "bg-orange-100 text-orange-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {scenario.surgeProbability}%
                    </span>
                  </td>
                  <td className="text-center p-3 text-gray-700">{scenario.avgWaitTime}</td>
                  <td className="text-center p-3 text-gray-700">{scenario.stabilityScore}</td>
                  <td className="text-center p-3 text-gray-700">{scenario.driverUtilization}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-line Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Wait Time Comparison Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: 'Wait Time (min)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="normal" stroke="#10b981" strokeWidth={2} name="Normal Day" />
            <Line type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2} name="Rain Event" />
            <Line type="monotone" dataKey="concert" stroke="#f59e0b" strokeWidth={2} name="Concert Event" />
            <Line type="monotone" dataKey="festival" stroke="#ef4444" strokeWidth={2} name="Festival" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Surge Probability Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={surgeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: 'Surge Probability (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="surge" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Auto-Generated Insights</h3>
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Key Finding #1</h4>
            <p className="text-gray-700">
              Festival scenarios show a <strong>250% increase</strong> in surge probability compared to normal days,
              with average wait times exceeding 11 minutes. This suggests critical need for dynamic driver allocation
              during major events.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Key Finding #2</h4>
            <p className="text-gray-700">
              System stability scores decrease by <strong>35%</strong> during high-demand scenarios. Implementing
              predictive surge pricing 30 minutes before peak demand could improve stability by recruiting more drivers
              proactively.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Recommendation</h4>
            <p className="text-gray-700">
              Based on the comparison, consider implementing an <strong>event-aware pricing algorithm</strong> that
              adjusts rates based on historical event patterns. This could reduce wait times by up to 40% while
              maintaining driver utilization above 80%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
