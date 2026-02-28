import { Download, FileText, Image, FileSpreadsheet, Eye } from "lucide-react";
import { Button } from "../components/ui/button";

export function Reports() {
  const recentSimulations = [
    {
      id: 1,
      date: "Feb 27, 2026",
      time: "14:32",
      parameters: "λ_r: 5.2, λ_d: 4.8",
      duration: "120 min",
      finalState: "Balanced",
      status: "Completed",
    },
    {
      id: 2,
      date: "Feb 26, 2026",
      time: "09:15",
      parameters: "λ_r: 7.5, λ_d: 4.0",
      duration: "90 min",
      finalState: "Surge",
      status: "Completed",
    },
    {
      id: 3,
      date: "Feb 25, 2026",
      time: "16:48",
      parameters: "λ_r: 9.0, λ_d: 5.5",
      duration: "150 min",
      finalState: "High Demand",
      status: "Completed",
    },
    {
      id: 4,
      date: "Feb 24, 2026",
      time: "11:22",
      parameters: "λ_r: 4.5, λ_d: 5.0",
      duration: "100 min",
      finalState: "Balanced",
      status: "Completed",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-3 gap-8">
        {/* Left: Recent Simulations */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Recent Simulations</h3>
            <div className="space-y-3">
              {recentSimulations.map((sim) => (
                <div
                  key={sim.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          Simulation #{sim.id}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {sim.date} at {sim.time}
                        </span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {sim.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Parameters: </span>
                          <span className="text-gray-900 font-mono">{sim.parameters}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration: </span>
                          <span className="text-gray-900">{sim.duration}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Final State: </span>
                          <span className={`font-medium ${
                            sim.finalState === "Balanced" ? "text-green-600" :
                            sim.finalState === "Surge" ? "text-red-600" :
                            "text-blue-600"
                          }`}>
                            {sim.finalState}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Export Options</h3>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <FileText className="w-6 h-6 text-red-500" />
                <span className="font-medium">PDF Report</span>
                <span className="text-xs text-gray-500">Full analysis</span>
              </Button>
              
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <FileSpreadsheet className="w-6 h-6 text-green-500" />
                <span className="font-medium">Export CSV</span>
                <span className="text-xs text-gray-500">Raw data</span>
              </Button>
              
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Image className="w-6 h-6 text-blue-500" />
                <span className="font-medium">Chart Images</span>
                <span className="text-xs text-gray-500">PNG format</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Report Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Report Preview</h3>
            
            {/* Mini preview */}
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

          {/* Key Metrics Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-3">Report Summary</h4>
            <div className="space-y-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-gray-500">Total Simulations</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-gray-500">Avg Stability Score</p>
                <p className="text-2xl font-bold text-green-600">0.84</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-gray-500">Most Common State</p>
                <p className="text-lg font-bold text-blue-600">Balanced</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
