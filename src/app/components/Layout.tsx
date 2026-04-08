import { Outlet, Link, useLocation } from "react-router";
import {
  Activity,
  Bell,
  CarFront,
  ChevronRight,
  FileBarChart,
  FileText,
  GitCompare,
  LayoutDashboard,
  PlayCircle,
  Search,
  User,
} from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    {
      path: "/app",
      label: "Dashboard",
      icon: LayoutDashboard,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-700",
    },
    {
      path: "/app/run-simulation",
      label: "Run Simulation",
      icon: PlayCircle,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-700",
    },
    {
      path: "/app/results",
      label: "Results",
      icon: FileText,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      path: "/app/live-simulation",
      label: "Live Simulation",
      icon: Activity,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      path: "/app/scenario-comparison",
      label: "Scenario Comparison",
      icon: GitCompare,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-700",
    },
    {
      path: "/app/reports",
      label: "Reports",
      icon: FileBarChart,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-700",
    },
  ];

  const currentPage = navItems.find((item) => item.path === location.pathname)?.label || "Dashboard";

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe_0%,_#eef4ff_26%,_#f8fafc_55%,_#f6fbff_100%)] p-4 text-slate-900 md:p-5">
      <aside className="w-[290px] shrink-0 pr-4">
        <div className="flex h-full flex-col rounded-[30px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_70px_rgba(37,99,235,0.12)] backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-3 px-2 pt-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 shadow-[0_4px_10px_rgba(37,99,235,0.18)]">
              <CarFront className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">RidePulse</h1>
          </div>


          <nav className="flex-1 mt-4">
            <ul className="space-y-2.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-3.5 transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-[0_6px_14px_rgba(37,99,235,0.22)]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                        isActive
                          ? "bg-white/18 text-white"
                          : `${item.iconBg} ${item.iconColor} group-hover:scale-105`
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`truncate font-semibold ${isActive ? "text-white" : "text-slate-900"}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                        {isActive ? "Currently open" : "Open section"}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-300"}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
          </nav>

          <div className="mt-6 rounded-[28px] bg-[linear-gradient(145deg,_#0f4ccf,_#1d72f2_55%,_#33c6dd)] p-5 text-white shadow-[0_22px_45px_rgba(29,114,242,0.26)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/18">
              <CarFront className="h-5 w-5" />
            </div>
            <h2 className="mb-1 text-lg font-semibold">Simulation Control</h2>
            <p className="text-sm leading-6 text-blue-100">
              Track live demand spikes, compare scenarios, and review outcomes from one workspace.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
        <header className="flex items-center justify-between border-b border-slate-200/70 px-8 py-5">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Operations Hub</p>
            <h2 className="text-2xl font-bold text-slate-900">{currentPage}</h2>
          </div>
          <div className="flex items-center gap-3">
            
            <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100">
                <User className="h-5 w-5 text-blue-700" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-slate-900">Control Desk</div>
                <div className="text-xs text-slate-400">Admin workspace</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
