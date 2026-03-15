import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  fetchFullSimulation,
  FullSimulationResponse,
  resolveSimulationId,
  saveLatestSimulationId,
} from "../lib/simulation";

type SimulationDataState = {
  simulationId: string | null;
  data: FullSimulationResponse | null;
  loading: boolean;
  error: string | null;
};

export function useSimulationData(): SimulationDataState {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<SimulationDataState>({
    simulationId: null,
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const loadSimulation = async () => {
      try {
        const idFromQuery = searchParams.get("id");
        const simulationId = await resolveSimulationId(idFromQuery);

        if (!simulationId) {
          if (!isCancelled) {
            setState({
              simulationId: null,
              data: null,
              loading: false,
              error: "No simulation found. Run a simulation first.",
            });
          }
          return;
        }

        saveLatestSimulationId(simulationId);
        const data = await fetchFullSimulation(simulationId);

        if (!data.result) {
          throw new Error("Simulation result is missing for this simulation id.");
        }

        if (!isCancelled) {
          setState({
            simulationId,
            data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            simulationId: null,
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load simulation data.",
          });
        }
      }
    };

    setState((prev) => ({ ...prev, loading: true, error: null }));
    loadSimulation();

    return () => {
      isCancelled = true;
    };
  }, [searchParams]);

  return state;
}
