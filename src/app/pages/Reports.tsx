import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Download, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  fetchSimulationHistory,
  SimulationHistoryItem,
} from "../lib/simulation";

function formatDate(dateString?: string) {
  if (!dateString) return "Unknown date";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateString?: string) {
  if (!dateString) return "Unknown time";
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Reports() {
  const [recentSimulations, setRecentSimulations] = useState<SimulationHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchSimulationHistory();
        setRecentSimulations(history.slice(0, 5));
      } catch (err) {
        setError("Unable to load recent simulations.");
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);


  return (
    <div className="p-8 space-y-8 ">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-3 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900">Recent Simulations</h3>
              {loadingHistory && <span className="text-sm text-gray-500">Loading...</span>}
            </div>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <div className="space-y-3">
              {recentSimulations.map((sim) => {
                const dateLabel = formatDate(sim.created_at);
                const timeLabel = formatTime(sim.created_at);
                const parameters = `λ_r: ${sim.lambda_r}, λ_d: ${sim.lambda_d}`;
                const finalState = sim.scenario_type || "Completed";

                return (
                  <div
                    key={sim.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">Simulation #{sim.id}</h4>
                          <span className="text-sm text-gray-500">{dateLabel} at {timeLabel}</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Completed
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Parameters: </span>
                            <span className="text-gray-900 font-mono">{parameters}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration: </span>
                            <span className="text-gray-900">{sim.duration} min</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Scenario: </span>
                            <span className={
                              `font-medium ${finalState === "Surge" ? "text-red-600" : "text-blue-600"}`
                            }>{finalState}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/app?id=${encodeURIComponent(sim.id)}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
              {recentSimulations.length === 0 && !loadingHistory && (
                <p className="text-sm text-gray-500">No recent simulations found.</p>
              )}
            </div>
          </div>
        </div>

        {/* <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Report Preview</h3>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    RP
                  </div>
                  <span className="font-semibold text-sm">RidePulse</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Simulation Report</h4>
                <p className="text-xs text-gray-500">Generated on Feb 28, 2026</p>
              </div>
              <div className="p-4 space-y-3 bg-white">
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="bg-blue-50 rounded p-2 space-y-1">
                  <div className="h-1.5 bg-blue-200 rounded w-3/4"></div>
                  <div className="h-1.5 bg-blue-200 rounded w-full"></div>
                  <div className="h-1.5 bg-blue-200 rounded w-2/3"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-100 rounded h-12"></div>
                  <div className="bg-gray-100 rounded h-12"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-4/6"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4">
              <Download className="w-4 h-4 mr-2" />
              Download Full Report
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
