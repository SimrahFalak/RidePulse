import { ArrowRight, CarFront, Route, TimerReset, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";

export function LandingPage() {
  const highlights = [
    {
      icon: Route,
      title: "Real-Time State Engine",
      description: "Track Markov state transitions across demand, supply, surge, and cancellation phases.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      icon: TrendingUp,
      title: "Scenario Intelligence",
      description: "Compare rain, events, and rush-hour scenarios with surge probability and stability metrics.",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      icon: TimerReset,
      title: "Live Playback",
      description: "Replay simulation timelines minute by minute with adaptive speed and transition logs.",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)]  flex-col p-7  md:p-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 shadow-[0_10px_22px_rgba(37,99,235,0.24)]">
              <CarFront className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">RidePulse</h1>
          </div>
         
        </header>

        <main className="mt-12 grid flex-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Ride Hailing Analytics Platform</p>
            <h2 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Simulate city-scale ride demand, predict surge risk, and act before service degrades.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              RidePulse models real ride-hailing dynamics with Poisson arrivals and Markov transitions so
              operations teams can test policies, validate driver capacity, and monitor stability in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-700 to-blue-600 px-7 text-white hover:from-blue-800 hover:to-blue-700"
                >
                  Launch Dashboard
                </Button>
              </Link>
              <Link to="/app/run-simulation">
                <Button variant="outline" size="lg" className="px-7">
                  Run Simulation
                </Button>
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-[linear-gradient(160deg,_#0f4ccf_0%,_#1e63df_50%,_#2ac1db_100%)] p-6 text-white shadow-[0_22px_48px_rgba(30,99,223,0.3)]">
            <h3 className="text-xl font-semibold">System Highlights</h3>
            <div className="mt-5 space-y-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}>
                        <Icon className={`h-5 w-5 ${item.iconColor}`} />
                      </div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                    </div>
                    <p className="text-sm leading-6 text-blue-50">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
