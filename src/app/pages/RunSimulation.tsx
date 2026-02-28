import { useState } from "react";
import { Slider } from "../components/ui/slider";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Info } from "lucide-react";

export function RunSimulation() {
  const [rideArrivalRate, setRideArrivalRate] = useState(5.0);
  const [driverServiceRate, setDriverServiceRate] = useState(4.5);
  const [duration, setDuration] = useState(120);
  const [iterations, setIterations] = useState(1000);
  const [surgeThreshold, setSurgeThreshold] = useState(75);

  const presets = [
    { name: "Normal Day", rideRate: 4.5, driverRate: 5.0 },
    { name: "Rain", rideRate: 7.5, driverRate: 4.0 },
    { name: "Concert Event", rideRate: 9.0, driverRate: 5.5 },
    { name: "Festival", rideRate: 12.0, driverRate: 6.0 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setRideArrivalRate(preset.rideRate);
    setDriverServiceRate(preset.driverRate);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="col-span-2 bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-8">
          {/* Demand Parameters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Demand Parameters</h3>
            <div className="space-y-3">
              <Label htmlFor="rideRate">Ride Arrival Rate (λ_r)</Label>
              <Input
                id="rideRate"
                type="number"
                value={rideArrivalRate}
                onChange={(e) => setRideArrivalRate(parseFloat(e.target.value))}
                step="0.1"
              />
              <p className="text-sm text-gray-500">Poisson arrival rate per minute</p>
              <Slider
                value={[rideArrivalRate]}
                onValueChange={(vals) => setRideArrivalRate(vals[0])}
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
                onChange={(e) => setDriverServiceRate(parseFloat(e.target.value))}
                step="0.1"
              />
              <p className="text-sm text-gray-500">Driver service rate per minute</p>
              <Slider
                value={[driverServiceRate]}
                onValueChange={(vals) => setDriverServiceRate(vals[0])}
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

          {/* Scenario Presets */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Scenario Presets</h3>
            <div className="grid grid-cols-4 gap-3">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  onClick={() => applyPreset(preset)}
                  className="w-full"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <Button className="w-full" size="lg">
            Run Simulation
          </Button>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Poisson Process</h4>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              The Poisson process models random arrivals of ride requests over time. The rate parameter λ_r
              determines the average number of requests per minute.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Markov Chain States</h4>
            </div>
            <p className="text-sm text-purple-800 leading-relaxed mb-3">
              The system transitions between different states:
            </p>
            <ul className="text-sm text-purple-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span><strong>Balanced:</strong> Supply meets demand</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span><strong>Surge:</strong> High demand, prices increase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span><strong>Shortage:</strong> Insufficient drivers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span><strong>Degradation:</strong> System instability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
