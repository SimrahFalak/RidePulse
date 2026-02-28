import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";

export function LiveSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  
  const [metrics, setMetrics] = useState({
    rideRequests: 45,
    availableDrivers: 38,
    surgeZones: 3,
    queueLength: 7,
    systemState: "Balanced",
  });

  // Simulate live updates
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 1);
      setMetrics({
        rideRequests: Math.floor(Math.random() * 30) + 30,
        availableDrivers: Math.floor(Math.random() * 20) + 25,
        surgeZones: Math.floor(Math.random() * 5),
        queueLength: Math.floor(Math.random() * 10) + 2,
        systemState: ["Balanced", "High Demand", "Surge"][Math.floor(Math.random() * 3)],
      });
    }, 2000 / (speed / 50));

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setMetrics({
      rideRequests: 45,
      availableDrivers: 38,
      surgeZones: 3,
      queueLength: 7,
      systemState: "Balanced",
    });
  };

  return (
    <div className="flex h-[calc(100vh-73px)] bg-gray-900">
      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Control Bar */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center gap-4 z-10">
          <Button
            variant={isRunning ? "default" : "outline"}
            size="icon"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Speed:</span>
            <Slider
              value={[speed]}
              onValueChange={(vals) => setSpeed(vals[0])}
              min={10}
              max={100}
              step={10}
              className="w-32"
            />
          </div>

          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>

          <div className={`px-3 py-1 rounded-lg font-medium text-sm ${
            isRunning ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}>
            {isRunning ? "Running" : "Paused"}
          </div>
        </div>

        {/* Map Canvas */}
        <div className="w-full h-full bg-gray-800 relative overflow-hidden">
          {/* Animated elements */}
          <div className="absolute inset-0">
            {/* Surge zones */}
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-red-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-orange-500 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Driver markers */}
            {[...Array(metrics.availableDrivers)].map((_, i) => (
              <div
                key={`driver-${i}`}
                className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-lg transition-all duration-1000"
                style={{
                  left: `${(Math.sin(currentTime * 0.1 + i) * 35) + 50}%`,
                  top: `${(Math.cos(currentTime * 0.1 + i) * 35) + 50}%`,
                }}
              />
            ))}

            {/* Ride request markers */}
            {[...Array(Math.min(metrics.rideRequests, 25))].map((_, i) => (
              <div
                key={`request-${i}`}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg animate-ping"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Time indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-gray-900">Time: {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Right Metrics Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto">
        <h3 className="font-semibold text-lg text-gray-900">Live Metrics</h3>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-600 mb-1">Current Ride Requests</p>
            <p className="text-3xl font-bold text-blue-900">{metrics.rideRequests}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <p className="text-sm text-green-600 mb-1">Available Drivers</p>
            <p className="text-3xl font-bold text-green-900">{metrics.availableDrivers}</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <p className="text-sm text-red-600 mb-1">Active Surge Zones</p>
            <p className="text-3xl font-bold text-red-900">{metrics.surgeZones}</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <p className="text-sm text-orange-600 mb-1">Queue Length</p>
            <p className="text-3xl font-bold text-orange-900">{metrics.queueLength}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 mb-1">Current System State</p>
            <p className="text-xl font-bold text-purple-900">{metrics.systemState}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-sm text-gray-900 mb-3">Event Log</h4>
          <div className="space-y-2 text-xs">
            <div className="bg-gray-50 rounded p-2 text-gray-700">
              <span className="font-medium">{String(Math.floor(currentTime / 60)).padStart(2, '0')}:{String(currentTime % 60).padStart(2, '0')}</span> - Surge activated in Zone 3
            </div>
            <div className="bg-gray-50 rounded p-2 text-gray-700">
              <span className="font-medium">{String(Math.floor((currentTime - 5) / 60)).padStart(2, '0')}:{String((currentTime - 5) % 60).padStart(2, '0')}</span> - 15 new ride requests
            </div>
            <div className="bg-gray-50 rounded p-2 text-gray-700">
              <span className="font-medium">{String(Math.floor((currentTime - 12) / 60)).padStart(2, '0')}:{String((currentTime - 12) % 60).padStart(2, '0')}</span> - 8 drivers went offline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
