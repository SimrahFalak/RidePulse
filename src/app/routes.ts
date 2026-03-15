import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { RunSimulation } from "./pages/RunSimulation";
import { Results } from "./pages/Results";
import { LiveSimulation } from "./pages/LiveSimulation";
import { ScenarioComparison } from "./pages/ScenarioComparison";
import { Reports } from "./pages/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "run-simulation", Component: RunSimulation },
      { path: "results", Component: Results },
      { path: "live-simulation", Component: LiveSimulation },
      { path: "scenario-comparison", Component: ScenarioComparison },
      { path: "reports", Component: Reports },
    ],
  },
]);
