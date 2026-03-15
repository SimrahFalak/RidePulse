import { Link } from "react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CarFront,
  CheckCircle2,
  Linkedin,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function LandingPage() {
  const stats = [
    { label: "Cities Worldwide", value: "150+", icon: Target },
    { label: "Simulations Run", value: "1.2M+", icon: Activity },
    { label: "Active Teams", value: "10K+", icon: Users },
  ];

  const services = [
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Monitor demand and supply patterns across your ride-hailing network with minute-level precision.",
      color: "from-blue-700 to-cyan-500",
    },
    {
      icon: Activity,
      title: "Live Simulation",
      description: "Watch your transportation network evolve with dynamic transitions and instant KPI updates.",
      color: "from-blue-600 to-sky-500",
    },
    {
      icon: BarChart3,
      title: "Predictive Modeling",
      description: "Forecast surge risk, utilization, and stability with data-driven stochastic workflows.",
      color: "from-cyan-600 to-blue-500",
    },
  ];

  const features = [
    {
      title: "Advanced Markov Chain Analysis",
      description:
        "Understand state transitions across normal, surge, and recovery phases with robust probability-driven modeling.",
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
      highlights: ["99.9% Accuracy", "Real-time Processing", "Predictive Insights"],
    },
    {
      title: "Poisson Process Modeling",
      description:
        "Model ride arrivals and service throughput to optimize staffing, dispatching, and expected rider wait times.",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      highlights: ["35% Cost Reduction", "Smart Fleet Allocation", "Dynamic Optimization"],
    },
    {
      title: "Scenario Comparison Engine",
      description:
        "Benchmark weather events, rush-hours, and special events side-by-side before rolling policies live.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      highlights: ["Multi-Scenario Testing", "A/B Comparison", "Performance Metrics"],
    },
  ];

  const benefits = [
    "Reduce waiting time",
    "Optimize driver utilization",
    "Predict surge windows earlier",
    "Minimize instability spikes",
    "Support data-backed policy",
    "Scale city operations",
  ];

  const testimonials = [
    {
      quote: "RidePulse transformed our operations. We reduced wait times by 38% in three months.",
      author: "Sarah Chen",
      role: "VP Operations, MetroRide",
      rating: 5,
    },
    {
      quote: "Predictive modeling is game-changing. We can plan capacity before surge events start.",
      author: "Michael Torres",
      role: "Data Science Lead, CityTransit",
      rating: 5,
    },
    {
      quote: "Clear ROI and smoother dispatch outcomes right from our first rollout phase.",
      author: "Emily Johnson",
      role: "CEO, QuickCab",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 shadow-[0_4px_10px_rgba(37,99,235,0.18)]">
              <CarFront className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">RidePulse</h1>
          </div>
          

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-5 text-base shadow-md shadow-blue-500/40 transition-all hover:from-blue-800 hover:to-cyan-600 hover:shadow-blue-500/60"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
            </div>
        </div>
      </header>

      <section className="relative overflow-hidden pb-20 pt-32">
        <div className="absolute inset-0">
          
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400  px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              Stochastic Simulation Platform
            </div>

            <h1 className="text-5xl font-bold leading-[1.10] text-slate-900 lg:text-6xl">
                Together, We Build {" "}
              <span className="animate-gradient bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                A Smarter
              </span>{" "}
              Ride Network.
            </h1>

            <p className="text-lg leading-relaxed text-slate-700">
              Revolutionize ride-hailing operations with advanced stochastic modeling, real-time analytics, and
              predictive planning workflows.
            </p>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-700 to-cyan-500 px-10 py-6 text-lg shadow-2xl shadow-blue-500/40 transition-all hover:from-blue-800 hover:to-cyan-600 hover:shadow-blue-500/60"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
            </div>

         
          </div>

          <div className="relative">
            <div className="animate-float absolute -left-8 -top-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">95%</p>
                  <p className="text-sm text-slate-500">Live State</p>
                </div>
              </div>
            </div>

            <div className="animate-float animation-delay-2000 absolute -right-8 top-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">80%</p>
                  <p className="text-sm text-slate-500">Risk Mitigation</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl">
              <div className="overflow-hidden rounded-3xl bg-white">
                <ImageWithFallback
                  src="/Hero.avif"
                  alt="Ride operations team"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="animate-float animation-delay-1000 absolute -bottom-6 -left-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">+78%</p>
                  <p className="text-sm text-slate-500">Efficiency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-2">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600" />
        
        <div className="relative w-full overflow-hidden border-y border-white/25 bg-white/10 py-4 backdrop-blur-sm">
          <div className="marquee-track flex min-w-max items-center gap-10 px-6 sm:px-10">
            <p className="text-2xl font-extrabold uppercase tracking-[0.16em] text-white lg:text-4xl">
              Challenging ourselves to build the world&apos;s best platform for
              <span className="ml-3 text-cyan-100">ride-hailing simulation.</span>
            </p>
            <p className="text-2xl font-extrabold uppercase tracking-[0.16em] text-white lg:text-4xl">
              Challenging ourselves to build the world&apos;s best platform for
              <span className="ml-3">ride-hailing simulation</span>
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400  px-4 py-2 text-sm font-semibold text-blue-700">
              <Zap className="h-4 w-4" />
              Our Services
            </div>
            <h2 className="mb-4 text-5xl font-bold text-slate-900">Comprehensive Tools for Modern Networks</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-700">Everything needed to optimize your ride-hailing platform.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} shadow-lg transition-transform group-hover:scale-110`}
                >
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                  {service.title}
                </h3>
                <p className="mb-2 leading-relaxed text-slate-600">{service.description}</p>
                
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-18">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-100 to-transparent opacity-50" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div className="relative">
            
            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-white">
                <ImageWithFallback
                  src="/ride.avif"
                  alt="Operations expert"
                  className="h-136 w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400  px-4 py-2 text-sm font-semibold text-blue-700">
              <Shield className="h-4 w-4" />
              Your Success Is Our Priority
            </div>

            <h2 className="text-5xl font-bold leading-tight text-slate-900">
              Your efficiency is our{" "}
              <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">obsession</span>
            </h2>

            <p className="text-lg leading-relaxed text-slate-700">
              Keep your network stable, reduce wait times, and optimize allocation through consistent simulation-led
              decisions.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                  <span className="font-medium text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>

            <Link to="/app/run-simulation">
              <Button size="lg" className="bg-gradient-to-r from-blue-700 to-cyan-500 shadow-xl shadow-blue-500/30 hover:from-blue-800 hover:to-cyan-600">
                Explore Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

   

      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600" />
       
        <div className="relative mx-auto w-full max-w-5xl px-4 text-center">
          <h2 className="mb-6 text-5xl font-bold leading-[1.10] text-white lg:text-5xl ">
            From Modeling to Operational Excellence
          </h2>
          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-blue-50">
            Join teams using RidePulse to optimize networks and deliver reliable rider experiences.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/app">
              <Button size="lg" className="bg-white px-12 py-6 text-lg text-blue-700 shadow-2xl hover:bg-slate-100">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
          </div>

        </div>
      </section>

      <footer className="bg-slate-900 py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12 grid gap-12 md:grid-cols-4">
            <div>
              <div className="mb-6 flex items-center gap-3">
               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 shadow-[0_4px_10px_rgba(37,99,235,0.18)]">
              <CarFront className="h-6 w-6 text-white" />
            </div>
                <span className="text-2xl font-bold">RidePulse</span>
              </div>
              <p className="mb-6 leading-relaxed text-slate-400">
                Advanced stochastic simulation platform for ride-hailing operations.
              </p>
             
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li>Dashboard</li>
                <li>Live Simulation</li>
                <li>Scenario Comparison</li>
                <li>Reports</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">Resources</h4>
              <ul className="space-y-3 text-slate-400">
                <li>Documentation</li>
                <li>Community</li>
                <li>Guides</li>
                <li>Status</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 md:flex-row">
            <p className="text-sm text-slate-400">© 2026 RidePulse. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
              
            </div>
          </div>
        </div>      </footer>
    </div>
  );
}
