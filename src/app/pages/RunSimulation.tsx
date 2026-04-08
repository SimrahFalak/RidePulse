import { useState } from "react";
import { Slider } from "../components/ui/slider";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router";
import { saveLatestSimulationId } from "../lib/simulation";

const rawApiUrl =
  (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  "http://localhost:8000";
const API_URL = rawApiUrl.replace(/\/+$/, "");

const RUN_SIMULATION_ENDPOINT = API_URL.endsWith("/api")
  ? `${API_URL}/simulation/run`
  : `${API_URL}/api/simulation/run`;

export function RunSimulation() {
  const navigate = useNavigate();
  const [rideArrivalRate, setRideArrivalRate] = useState(5.0);
  const [driverServiceRate, setDriverServiceRate] = useState(4.5);
  const [duration, setDuration] = useState(120);
  const [iterations, setIterations] = useState(1000);
  const [surgeThreshold, setSurgeThreshold] = useState(75);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { name: "Normal Day", rideRate: 4.5, driverRate: 5.0 },
    { name: "Rain", rideRate: 7.5, driverRate: 4.0 },
    { name: "Concert Event", rideRate: 9.0, driverRate: 5.5 },
    { name: "Festival", rideRate: 12.0, driverRate: 6.0 },
  ];

  const applyPreset = (preset: typeof presets[0], index: number) => {
    setRideArrivalRate(preset.rideRate);
    setDriverServiceRate(preset.driverRate);
    setActivePreset(index);
  };

  const handleRideRateChange = (value: number) => {
    setRideArrivalRate(value);
    setActivePreset(null); // Clear active state when manually changing
  };

  const handleDriverRateChange = (value: number) => {
    setDriverServiceRate(value);
    setActivePreset(null); // Clear active state when manually changing
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setError(null);

    const scenarioType = activePreset !== null ? presets[activePreset].name : "Custom";
    
    const payload = {
      scenario_type: scenarioType,
      lambda_r: rideArrivalRate,
      lambda_d: driverServiceRate,
      surge_threshold: surgeThreshold,
      duration: duration,
      iterations: iterations,
    };

    try {
      const response = await fetch(RUN_SIMULATION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
        );
      }

      const data = await response.json();
      console.log("Simulation created:", data);

      saveLatestSimulationId(data.simulation_id);
      
      // Navigate to results page with the simulation ID
      navigate(`/app/results?id=${data.simulation_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run simulation");
      console.error("Error running simulation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="col-span-2 bg-white p-4 mr-4 space-y-8">
         
         {/* Scenario Presets */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Scenario Presets</h3>
            <div className="grid grid-cols-4 gap-3">
              {presets.map((preset, index) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  onClick={() => applyPreset(preset, index)}
                  className={`w-full cursor-pointer ${
                    activePreset === index
                      ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white border-transparent hover:from-blue-800 hover:to-blue-700 hover:text-white"
                      : ""
                  }`}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
          {/* Demand Parameters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Demand Parameters</h3>
            <div className="space-y-3">
              <Label htmlFor="rideRate">Ride Arrival Rate (λ_r)</Label>
              <Input
                id="rideRate"
                type="number"
                value={rideArrivalRate}
                onChange={(e) => handleRideRateChange(parseFloat(e.target.value))}
                step="0.1"
              />
              <p className="text-sm text-gray-500">Poisson arrival rate per minute</p>
              <Slider
                value={[rideArrivalRate]}
                onValueChange={(vals) => handleRideRateChange(vals[0])}
                min={0}
                max={15}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Driver Parameters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Driver Parameters</h3>
            <div className="space-y-3">
              <Label htmlFor="driverRate">Driver Availability Rate (λ_d)</Label>
              <Input
                id="driverRate"
                type="number"
                value={driverServiceRate}
                onChange={(e) => handleDriverRateChange(parseFloat(e.target.value))}
                step="0.1"
              />
              <p className="text-sm text-gray-500">Driver service rate per minute</p>
              <Slider
                value={[driverServiceRate]}
                onValueChange={(vals) => handleDriverRateChange(vals[0])}
                min={0}
                max={15}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Simulation Controls</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Simulation Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iterations">Number of Iterations</Label>
                <Input
                  id="iterations"
                  type="number"
                  value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="surge">Surge Activation Threshold (%)</Label>
              <Input
                id="surge"
                type="number"
                value={surgeThreshold}
                onChange={(e) => setSurgeThreshold(parseInt(e.target.value))}
              />
              <Slider
                value={[surgeThreshold]}
                onValueChange={(vals) => setSurgeThreshold(vals[0])}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Run Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-800 hover:to-blue-700 border-none shadow-[0_4px_12px_rgba(37,99,235,0.22)]" 
            size="lg"
            onClick={handleRunSimulation}
            disabled={isLoading}
          >
            {isLoading ? "Running Simulation..." : "Run Simulation"}
          </Button>
        </div>

        {/* Info Panel */}
        <div className="space-y-5">
          <h3 className="font-bold text-lg text-slate-900">Simulation Methodology</h3>

          {/* Poisson Process */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 block"></span>
              </div>
              <h4 className="font-semibold text-slate-900">Poisson Process</h4>
            </div>
            <p className="text-sm leading-6 text-slate-500">
              Ride requests and driver availability follow Poisson distributions, modeling random arrivals
              over time. The rate parameter λ controls the average frequency of events per time unit.
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-center font-mono text-sm text-slate-700">
              P(k) = (λ^k × e^(-λ)) / k!
            </div>
          </div>

          {/* Markov Chain States */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500 block"></span>
              </div>
              <h4 className="font-semibold text-slate-900">Markov Chain States</h4>
            </div>
            <p className="text-sm leading-6 text-slate-500 mb-4">
              The system transitions between four operational states based on supply-demand dynamics and market conditions.
            </p>
            <ul className="space-y-1">
              {[
                { label: "Normal", desc: "Balanced supply and demand", color: "#10b981", text: "text-emerald-700" },
                { label: "High Demand", desc: "Demand outpaces driver supply", color: "#3b82f6", text: "text-blue-700" },
                { label: "Driver Shortage", desc: "Insufficient drivers available", color: "#f59e0b", text: "text-amber-700" },
                { label: "Surge", desc: "Peak load, prices elevated", color: "#ef4444", text: "text-red-700" },
                { label: "Long Wait", desc: "Extended rider wait times", color: "#6b7280", text: "text-slate-600" },
                { label: "Cancellations", desc: "High cancellation rate", color: "#8b5cf6", text: "text-violet-700" },
              ].map((s) => (
                <li key={s.label} className="flex items-center gap-3 px-1 py-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <div className="min-w-0">
                    <span className={`text-sm font-semibold ${s.text}`}>{s.label}</span>
                    <span className="ml-2 text-xs text-slate-400">{s.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
