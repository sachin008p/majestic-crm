import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const statsConfig = [
  { value: 500, suffix: "+", label: "Properties Managed" },
  { value: 1200, suffix: "+", label: "Client Relationships" },
  { value: 98, suffix: "%", label: "Follow-up Accuracy" },
];

const features = [
  {
    icon: "users",
    title: "Customer Management",
    desc: "Maintain complete buyer, seller and investor profiles with conversations, preferences and deal history.",
  },
  {
    icon: "pipeline",
    title: "Lead Pipeline",
    desc: "Track every inquiry from first contact to site visit, negotiation and closure with clear pipeline stages.",
  },
  {
    icon: "tasks",
    title: "Smart Follow-ups",
    desc: "Plan calls, site visits, reminders and documentation tasks so your team never misses an opportunity.",
  },
  {
    icon: "analytics",
    title: "Performance Analytics",
    desc: "Understand lead sources, conversion rates, active deals and team performance through real-time dashboards.",
  },
  {
    icon: "shield",
    title: "Secure Access",
    desc: "Role-based access and secure authentication help keep your business and customer data protected.",
  },
  {
    icon: "speed",
    title: "Fast Workflow",
    desc: "A focused CRM experience built for speed, clarity and daily usage by real estate sales teams.",
  },
];

const Icon = ({ name, className = "w-6 h-6" }) => {
  const common = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    users: (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    pipeline: (
      <svg {...common}>
        <path d="M4 6h16l-7 8v5l-2 1v-6L4 6Z" />
      </svg>
    ),
    tasks: (
      <svg {...common}>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    analytics: (
      <svg {...common}>
        <path d="M4 19h16" />
        <path d="M7 16l4-4 3 3 5-7" />
      </svg>
    ),
    shield: (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
    speed: (
      <svg {...common}>
        <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    ),
    check: (
      <svg {...common}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  };

  return icons[name] || null;
};

const AnimatedStat = ({ target, suffix }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
      else setValue(target);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <span>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = useMemo(
    () =>
      `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/20"
          : "bg-transparent py-5"
      }`,
    [scrolled]
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.20),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)]" />
        <div className="absolute left-1/2 top-0 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
        <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-24 top-96 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className={navClass}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-base font-semibold shadow-lg shadow-indigo-500/25">
              M
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight">Majestic Realities</div>
              <div className="text-xs font-medium text-slate-400">Real Estate CRM</div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#workflow" className="transition hover:text-white">Workflow</a>
            <a href="#security" className="transition hover:text-white">Security</a>
          </div>

          <Link
            to="/login"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Login to CRM
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen items-center pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
              Built for modern real estate teams
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Manage leads, clients and deals from one professional CRM.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Majestic Realities helps real estate teams capture inquiries, track follow-ups,
              manage customers and close property deals with a clean, reliable workflow.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-4 text-base font-semibold text-white shadow-2xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-indigo-500/35"
              >
                Get Started
                <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {statsConfig.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    <AnimatedStat target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Dashboard Mockup */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-sm font-semibold text-white">Sales Overview</div>
                  <div className="text-xs text-slate-400">Live pipeline performance</div>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Active</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Leads", "248", "#6366f1"],
                  ["Visits", "76", "#8b5cf6"],
                  ["Closed", "32", "#10b981"],
                ].map(([label, value, color]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="mt-2 text-2xl font-semibold" style={{ color }}>{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold">Pipeline</span>
                  <span className="text-xs text-slate-400">This month</span>
                </div>
                <div className="space-y-4">
                  {[
                    ["New Leads", 82, "bg-indigo-500"],
                    ["Site Visits", 58, "bg-purple-500"],
                    ["Negotiation", 44, "bg-amber-500"],
                    ["Won", 32, "bg-emerald-500"],
                  ].map(([label, width, color]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs text-slate-400">
                        <span>{label}</span>
                        <span>{width}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  ["Amit Sharma", "3BHK inquiry · Bandra", "Qualified"],
                  ["Priya Mehta", "Site visit scheduled", "Follow-up"],
                  ["Rohan Patel", "Negotiation in progress", "Hot Lead"],
                ].map(([name, detail, status]) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div>
                      <div className="text-sm font-medium text-white">{name}</div>
                      <div className="text-xs text-slate-400">{detail}</div>
                    </div>
                    <span className="rounded-full bg-indigo-400/10 px-2.5 py-1 text-xs font-medium text-indigo-200">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">Features</span>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Everything your real estate team needs to close more deals.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              A focused CRM experience designed around leads, customers, site visits,
              follow-ups and sales performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.06]"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-400/10 text-indigo-300 ring-1 ring-indigo-400/20 transition group-hover:bg-indigo-400/15">
                  <Icon name={feature.icon} />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm md:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">Workflow</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  From inquiry to closure — keep every step organized.
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-400">
                  Capture leads, assign ownership, schedule visits, track negotiations and
                  maintain follow-up discipline from one place.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Lead captured from source",
                  "Sales executive assigned",
                  "Site visit and follow-up planned",
                  "Deal tracked until closure",
                ].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/10 text-sm font-semibold text-indigo-200">
                      {index + 1}
                    </div>
                    <div className="flex items-start gap-3 text-sm font-medium text-slate-200">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security / CTA */}
      <section id="security" className="relative z-10 py-24">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 p-8 shadow-2xl shadow-indigo-950/30 backdrop-blur-sm md:p-12">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">Ready to grow?</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Build a more organized real estate sales operation.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Start using a CRM that gives your team clarity, accountability and faster follow-ups.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Login to CRM
              <Icon name="arrow" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-sm text-slate-400 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
              M
            </div>
            <span>© 2026 Majestic Realities. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
