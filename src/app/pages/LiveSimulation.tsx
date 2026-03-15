import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { useSimulationData } from "../hooks/useSimulationData";
import { STATE_COLORS, toStateLabel } from "../lib/simulation";

/**
 * Compute how many minutes to skip per tick based on slider speed and
 * simulation duration.
 *
 * Examples (duration = 120):
 *   speed = 50  (half)  → step = 2  → show min 0,2,4,...,120  (60 frames)
 *   speed = 100 (full)  → step = 60 → show min 0,60,120        (2 frames)
 */
function computeStepSize(speed: number, duration: number): number {
  if (duration <= 0) return 1;
  if (speed <= 50) {
    return Math.max(1, Math.round(speed / 25));
  }
  return Math.max(2, Math.round((speed / 100) * (duration / 2)));
}

export function LiveSimulation() {
  const { data, loading, error } = useSimulationData();
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [frameIndex, setFrameIndex] = useState(0);
  const framesLengthRef = useRef(1);

  const timeline = data?.result?.time_series_json ?? [];
  const duration = timeline.length;
  const stepSize = computeStepSize(speed, duration || 120);

  // Sample the timeline at stepSize intervals
  const frames = timeline.filter((_, i) => i % stepSize === 0);
  framesLengthRef.current = frames.length;

  const currentFrame = frames[frameIndex] ?? null;
  const stateColor = STATE_COLORS[currentFrame?.state ?? "S0_Normal"] ?? "#10b981";
  const progress = frames.length > 1 ? (frameIndex / (frames.length - 1)) * 100 : 0;
  const speedLabel = speed <= 30 ? "Slow (1x)" : speed <= 60 ? "Half (2x)" : "Fast";

  // Build real state-transition log from the full timeline
  const eventLog = (() => {
    const events: { minute: number; message: string; state: string }[] = [];
    for (let i = 1; i < timeline.length; i++) {
      if (timeline[i].state !== timeline[i - 1].state) {
        events.push({
          minute: timeline[i].minute,
          message: `→ ${toStateLabel(timeline[i].state)}`,
          state: timeline[i].state,
        });
      }
    }
    return events;
  })();

  // Tick interval – fires every 800 ms regardless of speed;
  // speed controls step size (minutes skipped), not tick rate.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setFrameIndex((prev) => {
        if (prev >= framesLengthRef.current - 1) {
          setIsRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(id);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setFrameIndex(0);
  };

  if (loading) {
    return <div className="p-8 text-gray-600">Loading simulation data...</div>;
  }

  if (error || !data?.result) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Unable to load simulation:</strong>{" "}
          {error || "Missing simulation result."}
        </div>
      </div>
    );
  }

  const visibleEvents = eventLog
    .filter((e) => e.minute <= (currentFrame?.minute ?? 0))
    .slice()
    .reverse()
    .slice(0, 12);

  const stateColorSoft = `${stateColor}1f`;
  const stateColorBorder = `${stateColor}4d`;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-white p-4 sm:p-5">
      <div className="grid grid-rows-[minmax(0,1fr)_auto] gap-4">
      <div className="relative h-[520px] overflow-hidden rounded-[24px] border border-slate-200 bg-white/65 shadow-[0_16px_44px_rgba(15,23,42,0.07)] backdrop-blur-sm sm:h-[600px]">

        {/* Control Bar */}
        <div className="absolute left-1/2 top-5 z-10 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-white/80 bg-white/92 px-5 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          <Button
            variant={isRunning ? "default" : "outline"}
            size="icon"
            onClick={() => setIsRunning(!isRunning)}
            disabled={frameIndex >= frames.length - 1}
            className={isRunning ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Speed: {speedLabel}
            </span>
            <Slider
              value={[speed]}
              onValueChange={(vals) => {
                setSpeed(vals[0]);
                setFrameIndex(0);
                setIsRunning(false);
              }}
              min={10}
              max={100}
              step={10}
              className="w-28"
            />
          </div>

          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>

          <div
            className="px-3 py-1 rounded-lg font-medium text-sm"
            style={{
              backgroundColor: isRunning ? "#dcfce7" : "#f3f4f6",
              color: isRunning ? "#15803d" : "#374151",
            }}
          >
            {isRunning ? "Running" : frameIndex >= frames.length - 1 ? "Finished" : "Paused"}
          </div>

          <span className="text-xs text-slate-400 whitespace-nowrap">{stepSize} min/tick</span>
        </div>

        {/* Canvas */}
        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_25%,_#2f4367_0%,_#1f304d_45%,_#152338_100%)] relative overflow-hidden">
          <div className="absolute inset-0">

            {/* Surge glow – visible when surge multiplier is elevated */}
            {(currentFrame?.surge_multiplier ?? 0) > 2.5 && (
              <>
                <div className="absolute top-1/4 left-1/3 w-56 h-56 bg-red-500 rounded-full opacity-25 blur-3xl animate-pulse" />
                <div
                  className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-orange-500 rounded-full opacity-20 blur-3xl animate-pulse"
                  style={{ animationDelay: "0.8s" }}
                />
              </>
            )}

            {/* Driver dots (supply) */}
            {[...Array(Math.min(currentFrame?.supply ?? 0, 30))].map((_, i) => (
              <div
                key={`driver-${i}`}
                className="absolute w-3.5 h-3.5 bg-blue-400 rounded-full shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                style={{
                  left: `${((Math.sin(i * 1.9 + frameIndex * 0.3) + 1) / 2) * 82 + 5}%`,
                  top: `${((Math.cos(i * 1.7 + frameIndex * 0.25) + 1) / 2) * 75 + 8}%`,
                  transition: "left 0.7s ease, top 0.7s ease",
                }}
              />
            ))}

            {/* Ride-request dots (demand) */}
            {[...Array(Math.min(currentFrame?.demand ?? 0, 20))].map((_, i) => (
              <div
                key={`req-${i}-${frameIndex}`}
                className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping shadow-md"
                style={{
                  left: `${((Math.sin(i * 2.3 + 1) + 1) / 2) * 85 + 5}%`,
                  top: `${((Math.cos(i * 2.1 + 0.5) + 1) / 2) * 78 + 8}%`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}

            {/* Queue overflow dots */}
            {[...Array(Math.min(Math.max(0, (currentFrame?.queue ?? 0) - (currentFrame?.supply ?? 0)), 15))].map((_, i) => (
              <div
                key={`q-${i}`}
                className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-70"
                style={{
                  left: `${((Math.sin(i * 1.1 + 2) + 1) / 2) * 40 + 30}%`,
                  top: `${((Math.cos(i * 1.3 + 1) + 1) / 2) * 40 + 30}%`,
                }}
              />
            ))}
          </div>

          {/* Map legend */}
          <div className="absolute top-24 left-4 rounded-xl border border-white/10 bg-slate-950/35 text-slate-100 text-xs px-3 py-2 space-y-1.5 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-400 rounded-full inline-block" />
              Drivers ({currentFrame?.supply ?? 0})
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block" />
              Requests ({currentFrame?.demand ?? 0})
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-400 rounded-full inline-block" />
              Queued ({currentFrame?.queue ?? 0})
            </div>
          </div>

          {/* Current state badge */}
          <div
            className="absolute top-24 right-4 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-[0_10px_24px_rgba(15,23,42,0.28)]"
            style={{ backgroundColor: stateColor }}
          >
            {toStateLabel(currentFrame?.state ?? "S0_Normal")}
          </div>

          {/* Timeline progress bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-950/62 backdrop-blur-sm px-6 py-3">
            <div className="flex items-center justify-between text-slate-100 text-xs mb-1.5">
              <span>Min 0</span>
              <span className="font-bold text-base">Minute {currentFrame?.minute ?? 0}</span>
              <span>Min {timeline[timeline.length - 1]?.minute ?? 0}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, backgroundColor: stateColor }}
              />
            </div>
            <div className="flex justify-between text-slate-300/75 text-xs mt-1">
              <span>Frame {frameIndex + 1} / {frames.length}</span>
              <span>Step: {stepSize} min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_16px_44px_rgba(15,23,42,0.07)] backdrop-blur-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-xl text-slate-900">Live Metrics</h3>
          <span className="text-xs text-slate-400">Minute {currentFrame?.minute ?? 0}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-xl p-4 border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm">
            <p className="text-sm text-blue-600 mb-1">Ride Requests</p>
            <p className="text-3xl font-bold text-blue-900 leading-none">{currentFrame?.demand ?? 0}</p>
          </div>

          <div className="rounded-xl p-4 border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/45 shadow-sm">
            <p className="text-sm text-green-600 mb-1">Active Drivers</p>
            <p className="text-3xl font-bold text-green-900 leading-none">{currentFrame?.supply ?? 0}</p>
          </div>

          <div className="rounded-xl p-4 border border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100/45 shadow-sm">
            <p className="text-sm text-orange-600 mb-1">Queue Length</p>
            <p className="text-3xl font-bold text-orange-900 leading-none">{currentFrame?.queue ?? 0}</p>
          </div>

          <div className="rounded-xl p-4 border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100/40 shadow-sm">
            <p className="text-sm text-red-600 mb-1">Wait Time</p>
            <p className="text-3xl font-bold text-red-900 leading-none">
              {currentFrame?.wait_time?.toFixed(1) ?? "0"}
              <span className="text-lg text-red-400 ml-1">min</span>
            </p>
          </div>

          <div className="rounded-xl p-4 border border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100/45 shadow-sm">
            <p className="text-sm text-yellow-600 mb-1">Surge Multiplier</p>
            <p className="text-3xl font-bold text-yellow-900 leading-none">
              {currentFrame?.surge_multiplier?.toFixed(2) ?? "1.00"}
              <span className="text-lg text-yellow-600 ml-1">x</span>
            </p>
          </div>

          <div
            className="rounded-xl p-4 border shadow-sm"
            style={{ backgroundColor: stateColorSoft, borderColor: stateColorBorder }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: stateColor }}>
              System State
            </p>
            <p className="text-xl font-bold text-gray-900">
              {toStateLabel(currentFrame?.state ?? "S0_Normal")}
            </p>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-slate-200">
          <h4 className="font-semibold text-sm text-slate-900 mb-3">State Transitions</h4>
          <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 xl:grid-cols-3">
            {visibleEvents.length === 0 ? (
              <p className="text-xs text-slate-400">No transitions yet.</p>
            ) : (
              visibleEvents.map((event, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white text-xs text-slate-700 flex items-center gap-2 px-2.5 py-2"
                  style={{ backgroundColor: (STATE_COLORS[event.state] ?? "#9ca3af") + "22" }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATE_COLORS[event.state] ?? "#9ca3af" }}
                  />
                  <span className="font-semibold text-gray-500">Min {event.minute}</span>
                  <span>{event.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
