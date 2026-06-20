import React, { useState, useEffect, useMemo, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

/*
 * =================================================================
 *  EVERYTHING ON THIS DASHBOARD IS DRIVEN BY YOUR DATABASE.
 *  - KPI counts, the donut, the conversion bar → computed from API data
 *  - Trend chips & sparklines → computed from each record's date field
 *    (createdAt | created_at | date). If a date isn't present, that
 *    element is simply hidden — we never invent or hardcode numbers.
 * =================================================================
 */

/* -----------------------------------------------------------------
   Small utilities
 ----------------------------------------------------------------- */
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#0891b2", "#16a34a", "#d97706", "#4f46e5"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const inr = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/* -----------------------------------------------------------------
   Date helpers — read whatever field name your backend uses.
   Returns null if there's no usable date (so we can skip the stat).
 ----------------------------------------------------------------- */
const readDate = (item) => {
  if (!item) return null;
  const raw = item.createdAt || item.created_at || item.date || item.dueDate || item.due_date;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
};

const sameMonth = (d, ref) =>
  d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();

/* Month-over-month % change, computed ONLY from real records.
   Returns null if the records have no dates (→ chip stays hidden). */
const monthlyTrend = (items) => {
  if (!items?.length) return null;
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  let cur = 0, prev = 0, hasDates = false;

  items.forEach((it) => {
    const d = readDate(it);
    if (!d) return;
    hasDates = true;
    if (sameMonth(d, thisMonth)) cur++;
    else if (sameMonth(d, lastMonth)) prev++;
  });

  if (!hasDates) return null; // no date data → don't fake a trend
  if (prev === 0) {
    return cur > 0
      ? { label: `${cur} new`, dir: "up", foot: "this month" }
      : null;
  }
  const pct = Math.round(((cur - prev) / prev) * 100);
  return {
    label: `${Math.abs(pct)}%`,
    dir: pct >= 0 ? "up" : "down",
    foot: "vs last month",
  };
};

/* Last-N-days sparkline, built ONLY from real created dates.
   Returns null if no record has a date in the window. */
const dailySpark = (items, days = 8) => {
  if (!items?.length) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets = Array.from({ length: days }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (days - 1 - i));
    return { day, count: 0 };
  });
  let any = false;

  items.forEach((it) => {
    const d = readDate(it);
    if (!d) return;
    const dd = new Date(d);
    dd.setHours(0, 0, 0, 0);
    const b = buckets.find((x) => x.day.getTime() === dd.getTime());
    if (b) { b.count++; any = true; }
  });

  return any ? buckets.map((b) => b.count) : null;
};

/* -----------------------------------------------------------------
   Animated counter
 ----------------------------------------------------------------- */
const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(step);
      else setCount(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span>{count.toLocaleString("en-IN")}</span>;
};

/* -----------------------------------------------------------------
   Sparkline (inline SVG, no deps) — only renders real data points
 ----------------------------------------------------------------- */
const Sparkline = ({ points = [], color = "#3b82f6" }) => {
  if (!points || points.length < 2) return null;
  const w = 92;
  const h = 34;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 6) - 3;
    return [x.toFixed(1), y.toFixed(1)];
  });
  const line = coords.map((c) => c.join(",")).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;

  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={area} fill={color} fillOpacity={0.13} stroke="none" />
      <polyline points={line} fill="none" stroke={color} strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* -----------------------------------------------------------------
   KPI card — trend & spark are optional (only real data)
 ----------------------------------------------------------------- */
const StatCard = ({ title, value, icon, iconBg, accent, loading, trend, spark, sparkColor }) => (
  <div className="relative rounded-2xl p-5 overflow-hidden
    bg-[var(--card)] border border-[var(--border)] shadow-sm
    hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="absolute left-0 top-0 h-full w-1" style={{ background: accent }} />

    <div className="flex justify-between items-start">
      <div>
        <p className="text-[13px] text-[var(--muted)] font-medium">{title}</p>
        <h2 className="text-[28px] font-extrabold mt-1 tracking-tight text-[var(--text)]">
          {loading ? <span className="opacity-40">…</span> : <AnimatedNumber value={value} />}
        </h2>
        {trend && trend.label && (
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[11px] font-bold px-2 py-[3px] rounded-md inline-flex items-center gap-1 ${trend.dir === "up"
                ? "text-[var(--success)] bg-[var(--success)]/10"
                : "text-[var(--danger)] bg-[var(--danger)]/10"}`}
              >{trend.dir === "up" ? "▲" : "▼"} {trend.label}</span>
            {trend.foot && <span className="text-[11px] text-[var(--muted)]">{trend.foot}</span>}
          </div>
        )}
      </div>

      <div className="w-10 h-10 rounded-xl grid place-items-center text-lg" style={{ background: iconBg }}>
        {icon}
      </div>
    </div>

    {!loading && spark && (
      <div className="absolute right-4 bottom-4 opacity-90">
        <Sparkline points={spark} color={sparkColor} />
      </div>
    )}
  </div>
);

/* -----------------------------------------------------------------
   Donut chart — pipeline by status (100% from leads)
 ----------------------------------------------------------------- */
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const R = 56;
  const C = 2 * Math.PI * R;
  let offset = 0;

  const segments = data.map((d) => {
    const frac = d.count / total;
    const seg = { ...d, dash: frac * C, gap: C - frac * C, off: -offset };
    offset += frac * C;
    return seg;
  });

  return (
    <div className="flex items-center gap-6 flex-wrap justify-center">
      <div className="relative w-[140px] h-[140px]">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={R} fill="none" stroke="var(--border)" strokeWidth="16" />
          {segments.map((s, i) => (
            <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={s.color}
              strokeWidth="16" strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.off} transform="rotate(-90 70 70)" />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-2xl font-extrabold">{total}</div>
            <div className="text-[11px] text-[var(--muted)]">leads</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <span className="w-[11px] h-[11px] rounded-[3px]" style={{ background: d.color }} />
            <span>{d.key}</span>
            <span className="font-bold ml-auto">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -----------------------------------------------------------------
   Status badges
 ----------------------------------------------------------------- */
const statusColor = (status = "") => {
  const map = {
    NEW: "b-NEW", CONTACTED: "b-CONTACTED", NEGOTIATION: "b-NEGOTIATION",
    WON: "b-WON", LOST: "b-LOST", ACTIVE: "b-NEW", PENDING: "b-PENDING",
    COMPLETED: "b-WON", HIGH: "b-HIGH", MEDIUM: "b-MEDIUM", LOW: "b-LOW",
  };
  return map[status] || "b-LOW";
};
const Badge = ({ status }) => (
  <span className={`badge ${statusColor(status)}`}>{status}</span>
);

/* -----------------------------------------------------------------
   Loading skeleton
 ----------------------------------------------------------------- */
const Skeleton = ({ className = "" }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

/* -----------------------------------------------------------------
   Dark mode toggle
 ----------------------------------------------------------------- */
const ThemeToggle = () => {
  const [dark, setDark] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };
  return (
    <button onClick={toggle} className="icon-btn" title="Toggle theme">
      {dark ? "🌙" : "☀️"}
    </button>
  );
};

/* =================================================================
   MAIN DASHBOARD
 ================================================================= */
const STATUS_DEFS = [
  { key: "NEW", color: "#3b82f6" },
  { key: "CONTACTED", color: "#6366f1" },
  { key: "NEGOTIATION", color: "#f59e0b" },
  { key: "WON", color: "#16a34a" },
  { key: "LOST", color: "#ef4444" },
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <div className="p-6 text-center text-[var(--muted)]">Loading dashboard...</div>;
  }
  console.log('Dashboard user object:', user);
  const isAdmin = user?.roles?.some(r => typeof r === 'string' && r.toUpperCase().includes('ADMIN')) || (typeof user?.role === 'string' && user.role.toUpperCase().includes('ADMIN'));
  const isTeamLeader = user?.roles?.some(r => typeof r === 'string' && r.toUpperCase().includes('TEAM_LEADER')) || (typeof user?.role === 'string' && user.role.toUpperCase().includes('TEAM_LEADER'));
  const isManager = user?.roles?.some(r => typeof r === 'string' && r.toUpperCase().includes('MANAGER')) || (typeof user?.role === 'string' && user.role.toUpperCase().includes('MANAGER')) || (typeof user?.roleName === 'string' && user.roleName.toUpperCase().includes('MANAGER'));
  const allowed = isAdmin || isTeamLeader || isManager;
  if (!allowed) {
    return <div className="p-6 text-center text-[var(--muted)]">Access denied: insufficient permissions.</div>;
  }

  // State hooks for dashboard data
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, customersRes, tasksRes] = await Promise.all([
        api.get('/api/leads'),
        api.get('/api/customers'),
        api.get('/api/tasks'),
      ]);
      setLeads(leadsRes.data);
      setCustomers(customersRes.data);
      setTasks(tasksRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Derived metrics
  const pipelineData = useMemo(
    () =>
      STATUS_DEFS.map(d => ({
        ...d,
        count: leads.filter(l => l.status === d.key).length,
      })).filter(d => d.count > 0),
    [leads]
  );

  const closedWon = useMemo(() => leads.filter(l => l.status === "WON").length, [leads]);
  const pendingTasks = useMemo(() => tasks.filter(t => t.status === "PENDING").length, [tasks]);
  const winRate = leads.length ? Math.round((closedWon / leads.length) * 100) : 0;
  const wonLeads = useMemo(() => leads.filter(l => l.status === "WON"), [leads]);
  const pendingTaskList = useMemo(() => tasks.filter(t => t.status === "PENDING"), [tasks]);

  // trends and sparklines
  const leadTrend = useMemo(() => monthlyTrend(leads), [leads]);
  const leadSpark = useMemo(() => dailySpark(leads), [leads]);
  const custTrend = useMemo(() => monthlyTrend(customers), [customers]);
  const custSpark = useMemo(() => dailySpark(customers), [customers]);
  const wonTrend = useMemo(() => monthlyTrend(wonLeads), [wonLeads]);
  const wonSpark = useMemo(() => dailySpark(wonLeads), [wonLeads]);
  const taskTrend = useMemo(() => monthlyTrend(pendingTaskList), [pendingTaskList]);
  const taskSpark = useMemo(() => dailySpark(pendingTaskList), [pendingTaskList]);

  return (
    <div className="space-y-6 pb-10 min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* ============ HEADER ============ */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-[42px] h-[42px] rounded-xl grid place-items-center text-white font-extrabold shadow-md" style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>CR</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CRM Dashboard</h1>
            <p className="text-xs text-[var(--muted)]">
              {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Loading…"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="icon-btn relative" title="Notifications">🔔<span className="dot-badge" /></button>
          <ThemeToggle />
          <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 transition flex items-center gap-2 text-sm font-semibold">↻ Refresh</button>
        </div>
      </div>

      {/* ============ USER PROFILE ============ */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0" style={{ background: avatarColor(user?.name || "U") }}>{initials(user?.name || "U")}</div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-bold text-[var(--text)]">{user?.name || "Welcome!"}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-1">✉️ {user?.email || "N/A"}</span>
            <span className="flex items-center gap-1">📱 {user?.phone || "N/A"}</span>
            <span className="flex items-center gap-1">🛡️ {user?.roles?.join(", ") || "EMPLOYEE"}</span>
          </div>
        </div>
        <div className="text-center md:text-right bg-black/5 dark:bg-white/5 p-4 rounded-xl shrink-0 border border-[var(--border)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-bold mb-1">Last Login</p>
          <p className="text-sm font-medium text-[var(--text)]">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "First time login"}</p>
        </div>
      </div>

      {/* ============ KPI CARDS ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[150px]" />)
        ) : (
          <>
            <StatCard title="Total Leads" value={leads.length} icon="📈" iconBg="rgba(59,130,246,.12)" accent="#3b82f6" trend={leadTrend} spark={leadSpark} sparkColor="#3b82f6" />
            <StatCard title="Customers" value={customers.length} icon="👥" iconBg="rgba(124,58,237,.12)" accent="#7c3aed" trend={custTrend} spark={custSpark} sparkColor="#7c3aed" />
            <StatCard title="Deals Closed" value={closedWon} icon="✅" iconBg="rgba(34,197,94,.14)" accent="#16a34a" trend={wonTrend} spark={wonSpark} sparkColor="#16a34a" />
            <StatCard title="Pending Tasks" value={pendingTasks} icon="⏳" iconBg="rgba(245,158,11,.14)" accent="#d97706" trend={taskTrend} spark={taskSpark} sparkColor="#f59e0b" />
          </>
        )}
      </div>

      {/* ============ CHARTS ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold">Lead Pipeline</h2>
              <p className="text-xs text-[var(--muted)]">By status</p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-[150px]" />
          ) : pipelineData.length === 0 ? (
            <p className="text-center py-10 text-[var(--muted)]">No pipeline data</p>
          ) : (
            <DonutChart data={pipelineData} />
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold">Conversion</h2>
              <p className="text-xs text-[var(--muted)]">{closedWon} won / {leads.length} total</p>
            </div>
            <span className="text-3xl font-extrabold text-[var(--success)]">{winRate}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[var(--border)] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${winRate}%`, background: "linear-gradient(90deg,#16a34a,#22c55e)" }} />
          </div>
          <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
            <span>0%</span>
            <span>Won rate this cycle</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* ============ RECENT LEADS ============ */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">Recent Leads</h2>
          <span className="text-xs text-[var(--muted)]">{leads.length} total</span>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : leads.length === 0 ? (
          <p className="text-center py-10 text-[var(--muted)]">No leads found</p>
        ) : (
          <div className="space-y-1">
            {leads.slice(0, 6).map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition">
                <div className="w-10 h-10 rounded-xl grid place-items-center text-white font-bold text-sm shrink-0" style={{ background: avatarColor(lead.name) }}>{initials(lead.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{lead.name}</p>
                  <p className="text-xs text-[var(--muted)] truncate">{lead.email}</p>
                </div>
                {lead.value != null && (<span className="font-bold text-sm hidden sm:block">{inr(lead.value)}</span>)}
                <Badge status={lead.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ RECENT TASKS ============ */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">Recent Tasks</h2>
          <span className="text-xs text-[var(--muted)]">{pendingTasks} pending</span>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center py-10 text-[var(--muted)]">No tasks found</p>
        ) : (
          <div className="space-y-1">
            {tasks.slice(0, 6).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition">
                <div className="w-10 h-10 rounded-xl grid place-items-center text-white font-bold" style={{ background: task.status === "COMPLETED" ? "#16a34a" : "#f59e0b" }}>{task.status === "COMPLETED" ? "✓" : "•"}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{task.title}</p>
                  <p className="text-xs text-[var(--muted)] truncate">{task.leadName || "No lead"}{task.dueDate || task.due_date ? ` · ${task.dueDate || task.due_date}` : ""}</p>
                </div>
                <div className="flex gap-1.5">
                  <Badge status={task.priority} />
                  <Badge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
