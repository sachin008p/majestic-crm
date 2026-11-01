import React, { useState, useEffect, useMemo, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/* ─── Utilities ──────────────────────────────────────────── */
const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

const AVATAR_COLORS = ["#4f46e5","#7c3aed","#db2777","#ea580c","#0891b2","#16a34a","#d97706","#be185d"];
const avatarColor = (name = "") => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const readDate = (item) => {
  if (!item) return null;
  const raw = item.createdAt || item.created_at || item.date || item.dueDate || item.due_date;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
};

const sameMonth = (d, ref) =>
  d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();

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
  if (!hasDates) return null;
  if (prev === 0) return cur > 0 ? { label: `${cur} new`, dir: "up", foot: "this month" } : null;
  const pct = Math.round(((cur - prev) / prev) * 100);
  return { label: `${Math.abs(pct)}%`, dir: pct >= 0 ? "up" : "down", foot: "vs last month" };
};

const dailySpark = (items, days = 8) => {
  if (!items?.length) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const buckets = Array.from({ length: days }, (_, i) => {
    const day = new Date(today); day.setDate(today.getDate() - (days - 1 - i));
    return { day, count: 0 };
  });
  let any = false;
  items.forEach((it) => {
    const d = readDate(it);
    if (!d) return;
    const dd = new Date(d); dd.setHours(0, 0, 0, 0);
    const b = buckets.find((x) => x.day.getTime() === dd.getTime());
    if (b) { b.count++; any = true; }
  });
  return any ? buckets.map((b) => b.count) : null;
};

/* ─── Animated Counter ───────────────────────────────────── */
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

/* ─── Sparkline ──────────────────────────────────────────── */
const Sparkline = ({ points = [], color = "#3b82f6" }) => {
  if (!points || points.length < 2) return null;
  const w = 92, h = 34;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 6) - 3;
    return [x.toFixed(1), y.toFixed(1)];
  });
  const line = coords.map((c) => c.join(",")).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={area} fill={color} fillOpacity={0.13} stroke="none" />
      <polyline points={line} fill="none" stroke={color} strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ─── Stat Card ──────────────────────────────────────────── */
const StatCard = ({ title, value, icon, iconBg, accent, loading, trend, spark, sparkColor, onClick }) => (
  <div
    onClick={onClick}
    className={`relative rounded-2xl p-5 overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="absolute left-0 top-0 h-full w-1" style={{ background: accent }} />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[13px] text-[var(--muted)] font-medium">{title}</p>
        <h2 className="text-[28px] font-extrabold mt-1 tracking-tight text-[var(--text)]">
          {loading ? <span className="opacity-40">…</span> : <AnimatedNumber value={value} />}
        </h2>
        {trend && trend.label && (
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[11px] font-bold px-2 py-[3px] rounded-md inline-flex items-center gap-1 ${trend.dir === "up" ? "text-[var(--success)] bg-[var(--success)]/10" : "text-[var(--danger)] bg-[var(--danger)]/10"}`}>
              {trend.dir === "up" ? "▲" : "▼"} {trend.label}
            </span>
            {trend.foot && <span className="text-[11px] text-[var(--muted)]">{trend.foot}</span>}
          </div>
        )}
      </div>
      <div className="w-11 h-11 rounded-xl grid place-items-center text-xl" style={{ background: iconBg }}>
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

/* ─── Donut Chart ────────────────────────────────────────── */
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const R = 54, C = 2 * Math.PI * R;
  let offset = 0;
  const segments = data.map((d) => {
    const frac = d.count / total;
    const seg = { ...d, dash: frac * C, gap: C - frac * C, off: -offset };
    offset += frac * C;
    return seg;
  });
  return (
    <div className="flex items-center gap-6 flex-wrap justify-center">
      <div className="relative w-[132px] h-[132px]">
        <svg width="132" height="132" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={R} fill="none" stroke="var(--border)" strokeWidth="15" />
          {segments.map((s, i) => (
            <circle key={i} cx="66" cy="66" r={R} fill="none" stroke={s.color}
              strokeWidth="15" strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.off} transform="rotate(-90 66 66)" />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-xl font-extrabold">{total}</div>
            <div className="text-[10px] text-[var(--muted)]">total</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <span className="w-[10px] h-[10px] rounded-[3px]" style={{ background: d.color }} />
            <span className="text-[var(--muted)]">{d.key}</span>
            <span className="font-bold ml-auto">{d.count}</span>
            <span className="text-[11px] text-[var(--muted)] w-10 text-right">{Math.round((d.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Status Badges ──────────────────────────────────────── */
const statusColor = (status = "") => {
  const map = { NEW: "b-NEW", CONTACTED: "b-CONTACTED", NEGOTIATION: "b-NEGOTIATION", WON: "b-WON", LOST: "b-LOST", ACTIVE: "b-NEW", PENDING: "b-PENDING", COMPLETED: "b-WON", HIGH: "b-HIGH", MEDIUM: "b-MEDIUM", LOW: "b-LOW" };
  return map[status] || "b-LOW";
};
const Badge = ({ status }) => <span className={`badge ${statusColor(status)}`}>{status}</span>;

/* ─── Skeleton ───────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => <div className={`skeleton rounded-xl ${className}`} />;

/* ─── Win Rate Ring ──────────────────────────────────────── */
const WinRateRing = ({ rate }) => {
  const R = 44, C = 2 * Math.PI * R;
  const dash = (rate / 100) * C;
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="56" cy="56" r={R} fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle cx="56" cy="56" r={R} fill="none" stroke="#16a34a" strokeWidth="10"
          strokeDasharray={`${dash} ${C}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl font-black text-[var(--success)]">{rate}%</div>
          <div className="text-[10px] text-[var(--muted)] font-semibold">Win Rate</div>
        </div>
      </div>
    </div>
  );
};

/* ─── Quick Action Button ────────────────────────────────── */
const QuickAction = ({ label, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:-translate-y-1 hover:shadow-md transition-all duration-200 group"
  >
    <div className="w-10 h-10 rounded-xl grid place-items-center text-xl" style={{ background: `${color}18` }}>
      {icon}
    </div>
    <span className="text-xs font-semibold text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">{label}</span>
  </button>
);

/* ─── Pipeline Definitions ───────────────────────────────── */
const STATUS_DEFS = [
  { key: "NEW", color: "#3b82f6" },
  { key: "CONTACTED", color: "#6366f1" },
  { key: "NEGOTIATION", color: "#f59e0b" },
  { key: "WON", color: "#16a34a" },
  { key: "LOST", color: "#ef4444" },
];

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <div className="p-6 text-center text-[var(--muted)]">Loading dashboard...</div>;

  const isAdmin = user?.roles?.some(r => typeof r === 'string' && r.toUpperCase().includes('ADMIN')) || (typeof user?.role === 'string' && user.role.toUpperCase().includes('ADMIN'));
  const isTeamLeader = user?.roles?.some(r => typeof r === 'string' && r.toUpperCase().includes('TEAM_LEADER')) || (typeof user?.role === 'string' && user.role.toUpperCase().includes('TEAM_LEADER'));
  const isManager = user?.roles?.some(r => typeof r === 'string' && r.toUpperCase().includes('MANAGER')) || (typeof user?.role === 'string' && user.role.toUpperCase().includes('MANAGER')) || (typeof user?.roleName === 'string' && user.roleName.toUpperCase().includes('MANAGER'));
  const allowed = isAdmin || isTeamLeader || isManager;
  if (!allowed) return <div className="p-6 text-center text-[var(--muted)]">Access denied: insufficient permissions.</div>;

  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

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

  useEffect(() => { fetchData(); }, []);

  /* ── Derived data ── */
  const pipelineData = useMemo(
    () => STATUS_DEFS.map(d => ({ ...d, count: leads.filter(l => l.status === d.key).length })).filter(d => d.count > 0),
    [leads]
  );
  const closedWon = useMemo(() => leads.filter(l => l.status === "WON").length, [leads]);
  const pendingTasks = useMemo(() => tasks.filter(t => t.status === "PENDING").length, [tasks]);
  const overdueTasks = useMemo(() => tasks.filter(t => t.status === "PENDING" && t.dueDate && new Date(t.dueDate) < new Date()).length, [tasks]);
  const winRate = leads.length ? Math.round((closedWon / leads.length) * 100) : 0;
  const wonLeads = useMemo(() => leads.filter(l => l.status === "WON"), [leads]);
  const pendingTaskList = useMemo(() => tasks.filter(t => t.status === "PENDING"), [tasks]);
  const totalBudget = useMemo(() => wonLeads.reduce((s, l) => s + Number(l.budget || l.value || 0), 0), [wonLeads]);

  const leadTrend = useMemo(() => monthlyTrend(leads), [leads]);
  const leadSpark = useMemo(() => dailySpark(leads), [leads]);
  const custTrend = useMemo(() => monthlyTrend(customers), [customers]);
  const custSpark = useMemo(() => dailySpark(customers), [customers]);
  const wonTrend = useMemo(() => monthlyTrend(wonLeads), [wonLeads]);
  const wonSpark = useMemo(() => dailySpark(wonLeads), [wonLeads]);
  const taskTrend = useMemo(() => monthlyTrend(pendingTaskList), [pendingTaskList]);
  const taskSpark = useMemo(() => dailySpark(pendingTaskList), [pendingTaskList]);

  /* ── Activity feed ── */
  const activityFeed = useMemo(() => {
    const items = [
      ...leads.slice(0, 10).map(l => ({ type: 'lead', icon: '📈', color: '#4f46e5', name: l.name, detail: `Lead — ${l.status}`, date: readDate(l) })),
      ...customers.slice(0, 5).map(c => ({ type: 'customer', icon: '👥', color: '#7c3aed', name: c.name, detail: 'Customer Added', date: readDate(c) })),
      ...tasks.slice(0, 5).map(t => ({ type: 'task', icon: '✅', color: '#16a34a', name: t.title, detail: `Task — ${t.status}`, date: readDate(t) })),
    ].filter(i => i.date).sort((a, b) => b.date - a.date).slice(0, 8);
    return items;
  }, [leads, customers, tasks]);

  const timeAgo = (date) => {
    if (!date) return '';
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-6 pb-10 min-h-screen bg-[var(--bg)] text-[var(--text)]">

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
        <div>
          <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wider mb-1">CRM Dashboard</p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {overdueTasks > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-600 text-sm font-semibold">
              ⚠️ {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''}
            </div>
          )}
          <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 transition flex items-center gap-2 text-sm font-semibold">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* ══ QUICK ACTIONS ══════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickAction label="New Lead" icon="📈" color="#4f46e5" onClick={() => navigate('/leads/create')} />
        <QuickAction label="New Task" icon="✅" color="#7c3aed" onClick={() => navigate('/tasks/create')} />
        <QuickAction label="New Customer" icon="👥" color="#0891b2" onClick={() => navigate('/customers/create')} />
        <QuickAction label="All Leads" icon="📊" color="#16a34a" onClick={() => navigate('/leads')} />
      </div>

      {/* ══ KPI CARDS ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[150px]" />)
        ) : (
          <>
            <StatCard title="Total Leads" value={leads.length} icon="📈" iconBg="rgba(59,130,246,.12)" accent="#3b82f6" trend={leadTrend} spark={leadSpark} sparkColor="#3b82f6" onClick={() => navigate('/leads')} />
            <StatCard title="Customers" value={customers.length} icon="👥" iconBg="rgba(124,58,237,.12)" accent="#7c3aed" trend={custTrend} spark={custSpark} sparkColor="#7c3aed" onClick={() => navigate('/customers')} />
            <StatCard title="Deals Closed" value={closedWon} icon="✅" iconBg="rgba(34,197,94,.14)" accent="#16a34a" trend={wonTrend} spark={wonSpark} sparkColor="#16a34a" />
            <StatCard title="Pending Tasks" value={pendingTasks} icon="⏳" iconBg="rgba(245,158,11,.14)" accent="#d97706" trend={taskTrend} spark={taskSpark} sparkColor="#f59e0b" onClick={() => navigate('/tasks')} />
          </>
        )}
      </div>

      {/* ══ CHARTS ROW ══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Pipeline Donut */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold">Lead Pipeline</h2>
            <p className="text-xs text-[var(--muted)]">Distribution by status</p>
          </div>
          {loading ? <Skeleton className="h-[150px]" /> :
            pipelineData.length === 0 ? <p className="text-center py-10 text-[var(--muted)]">No pipeline data</p> :
            <DonutChart data={pipelineData} />
          }
        </div>

        {/* Win Rate + Revenue */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-bold mb-1">Conversion</h2>
          <p className="text-xs text-[var(--muted)] mb-5">{closedWon} won / {leads.length} total</p>
          {loading ? <Skeleton className="h-[150px]" /> : (
            <>
              <WinRateRing rate={winRate} />
              <div className="mt-5 pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--muted)] mb-1 font-semibold uppercase tracking-wider">Revenue Won</p>
                <p className="text-2xl font-extrabold text-[var(--success)]">{inr(totalBudget)}</p>
              </div>
            </>
          )}
        </div>

        {/* Task breakdown */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-bold mb-1">Task Overview</h2>
          <p className="text-xs text-[var(--muted)] mb-4">{tasks.length} tasks total</p>
          {loading ? <Skeleton className="h-[150px]" /> : (
            <div className="space-y-3">
              {[
                { label: 'Pending', count: tasks.filter(t => t.status === 'PENDING').length, color: '#f59e0b' },
                { label: 'In Progress', count: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#3b82f6' },
                { label: 'Completed', count: tasks.filter(t => t.status === 'COMPLETED').length, color: '#16a34a' },
                { label: 'Overdue', count: overdueTasks, color: '#ef4444' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[var(--muted)]">{item.label}</span>
                    <span style={{ color: item.color }}>{item.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: tasks.length ? `${Math.round((item.count / tasks.length) * 100)}%` : '0%', background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ RECENT LEADS + ACTIVITY ══════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Leads */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold">Recent Leads</h2>
            <button onClick={() => navigate('/leads')} className="text-xs text-[var(--primary)] font-semibold hover:underline">View all →</button>
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : leads.length === 0 ? (
            <p className="text-center py-10 text-[var(--muted)]">No leads found</p>
          ) : (
            <div className="space-y-1">
              {leads.slice(0, 6).map((lead) => (
                <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-white font-bold text-sm shrink-0" style={{ background: avatarColor(lead.name) }}>
                    {initials(lead.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate text-sm">{lead.name}</p>
                    <p className="text-xs text-[var(--muted)] truncate">{lead.email}</p>
                  </div>
                  {lead.budget != null && <span className="font-bold text-xs hidden sm:block text-[var(--success)]">{inr(lead.budget)}</span>}
                  <Badge status={lead.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold">Recent Activity</h2>
            <span className="text-xs text-[var(--muted)]">{activityFeed.length} events</span>
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : activityFeed.length === 0 ? (
            <p className="text-center py-10 text-[var(--muted)]">No recent activity</p>
          ) : (
            <div className="relative pl-2">
              <div className="space-y-4">
                {activityFeed.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-xl grid place-items-center text-base shrink-0" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-[var(--muted)]">{item.detail}</p>
                    </div>
                    {item.date && <span className="text-[11px] text-[var(--muted)] shrink-0 pt-1">{timeAgo(item.date)}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ RECENT TASKS ════════════════════════════════════ */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">Recent Tasks</h2>
          <button onClick={() => navigate('/tasks')} className="text-xs text-[var(--primary)] font-semibold hover:underline">View all →</button>
        </div>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : tasks.length === 0 ? (
          <p className="text-center py-10 text-[var(--muted)]">No tasks found</p>
        ) : (
          <div className="space-y-1">
            {tasks.slice(0, 6).map((task) => {
              const isOverdue = task.status === 'PENDING' && task.dueDate && new Date(task.dueDate) < new Date();
              return (
                <div key={task.id} onClick={() => navigate(`/tasks/${task.id}/edit`)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-white font-bold shrink-0"
                    style={{ background: task.status === "COMPLETED" ? "#16a34a" : isOverdue ? "#ef4444" : "#f59e0b" }}>
                    {task.status === "COMPLETED" ? "✓" : isOverdue ? "!" : "•"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate text-sm">{task.title}</p>
                    <p className="text-xs text-[var(--muted)] truncate">
                      {task.leadName || "No lead"}
                      {(task.dueDate || task.due_date) ? ` · Due: ${new Date(task.dueDate || task.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}` : ""}
                      {isOverdue ? " · ⚠ Overdue" : ""}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Badge status={task.priority} />
                    <Badge status={task.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
