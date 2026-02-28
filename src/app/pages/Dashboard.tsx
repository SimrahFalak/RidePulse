import { ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function Dashboard() {
  // KPI data
  const kpis = [
    { label: "Total Ride Requests", value: "1,407", trend: "up", change: "+12%" },
    { label: "Active Drivers", value: "342", trend: "up", change: "+8%" },
    { label: "Surge Probability", value: "23%", trend: "down", change: "-5%" },
    { label: "Avg Waiting Time", value: "4.2", unit: "min", trend: "down", change: "-15%" },
    { label: "Driver Utilization", value: "78%", trend: "up", change: "+3%" },
    { label: "System Stability Index", value: "0.89", trend: "up", change: "+2%" },
  ];

  // Demand vs Supply data
  const demandSupplyData = [
    { time: "00:00", demand: 120, supply: 140 },
    { time: "04:00", demand: 80, supply: 90 },
    { time: "08:00", demand: 300, supply: 280 },
    { time: "12:00", demand: 250, supply: 260 },
    { time: "16:00", demand: 280, supply: 270 },
    { time: "20:00", demand: 350, supply: 320 },
    { time: "24:00", demand: 200, supply: 210 },
  ];

  // State distribution data
  const stateData = [
    { name: "Balanced", value: 45, color: "#10b981" },
    { name: "Surge", value: 25, color: "#ef4444" },
    { name: "Shortage", value: 20, color: "#f59e0b" },
    { name: "Degradation", value: 10, color: "#6b7280" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-2">{kpi.label}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {kpi.value}
                  {kpi.unit && <span className="text-lg text-gray-500 ml-1">{kpi.unit}</span>}
                </p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                kpi.trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                {kpi.trend === "up" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{kpi.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Demand vs Supply Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demandSupplyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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
                fill="#8884d8"
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

      {/* Map Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">City Demand Heatmap</h3>
        <div className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden">
          {/* Simplified map visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-full h-full relative">
                {/* Surge zones */}
                <div className="absolute top-20 left-32 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute bottom-24 right-40 w-40 h-40 bg-orange-300 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute top-40 right-32 w-24 h-24 bg-yellow-300 rounded-full opacity-50 blur-2xl"></div>
                
                {/* Driver dots */}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-lg"
                    style={{
                      left: `${Math.random() * 90 + 5}%`,
                      top: `${Math.random() * 90 + 5}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Simulation Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Recent Simulation Summary</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Ride Arrival Rate (λ_r)</p>
            <p className="text-xl font-semibold text-gray-900">5.2/min</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Driver Service Rate (λ_d)</p>
            <p className="text-xl font-semibold text-gray-900">4.8/min</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Duration</p>
            <p className="text-xl font-semibold text-gray-900">120 min</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Final State</p>
            <p className="text-xl font-semibold text-green-600">Balanced</p>
          </div>
        </div>
      </div>
    </div>
  );
}
