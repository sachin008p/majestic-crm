import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { leadService } from "../../services/leadService";

/* =================================================================
   UTILITIES
================================================================= */
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AVATAR_COLORS = [
  "#155eef",
  "#6941c6",
  "#c11574",
  "#b54708",
  "#0e9384",
  "#067647",
  "#d97706",
  "#3538cd",
];

const avatarColor = (name = "") =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const formatBudget = (budget) => {
  if (budget === null || budget === undefined || budget === "") return "-";
  const num = typeof budget === "number" ? budget : parseFloat(budget);
  if (isNaN(num)) return "-";
  return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const statusClass = (status = "") => {
  const map = {
    NEW: "b-NEW",
    CONTACTED: "b-CONTACTED",
    QUALIFIED: "b-QUALIFIED",
    NEGOTIATION: "b-NEGOTIATION",
    WON: "b-WON",
    LOST: "b-LOST",
  };
  return map[status] || "b-LOW";
};

const Badge = ({ status }) => <span className={`ll-badge ${statusClass(status)}`}>{status || "-"}</span>;

/* =================================================================
   ICONS
================================================================= */
const Icon = ({ type }) => {
  const common = { viewBox: "0 0 24 24", fill: "none", width: 18, height: 18 };
  const stroke = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

  const icons = {
    search: (
      <svg {...common}>
        <path {...stroke} d="m21 21-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
      </svg>
    ),
    refresh: (
      <svg {...common}>
        <path {...stroke} d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path {...stroke} d="M3 21v-5h5" />
        <path {...stroke} d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path {...stroke} d="M21 3v5h-5" />
      </svg>
    ),
    filter: (
      <svg {...common}>
        <path {...stroke} d="M4 6h16M7 12h10M10 18h4" />
      </svg>
    ),
    mail: (
      <svg {...common}>
        <path {...stroke} d="M4 4h16v16H4z" />
        <path {...stroke} d="m22 6-10 7L2 6" />
      </svg>
    ),
    company: (
      <svg {...common}>
        <path {...stroke} d="M3 21h18" />
        <path {...stroke} d="M5 21V5a2 2 0 0 1 2-2h7v18" />
        <path {...stroke} d="M14 8h3a2 2 0 0 1 2 2v11" />
        <path {...stroke} d="M8 7h2M8 11h2M8 15h2" />
      </svg>
    ),
    money: (
      <svg {...common}>
        <path {...stroke} d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    calendar: (
      <svg {...common}>
        <path {...stroke} d="M8 2v4M16 2v4M3 10h18" />
        <path {...stroke} d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  };

  return icons[type] || null;
};

/* =================================================================
   SKELETON
================================================================= */
const CardSkeleton = () => (
  <div className="ll-card ll-skeleton-card">
    <div className="ll-skeleton ll-sk-sm" />
    <div className="ll-skeleton ll-sk-title" />
    <div className="ll-skeleton ll-sk-line" />
    <div className="ll-skeleton ll-sk-line short" />
    <div className="ll-skeleton ll-sk-btn" />
  </div>
);

/* =================================================================
   STAT CARD
================================================================= */
const StatCard = ({ label, value, accent }) => (
  <div className="ll-stat-card">
    <div className="ll-stat-accent" style={{ background: accent }} />
    <p style={{ color: accent }}>{value}</p>
    <span>{label}</span>
  </div>
);

/* =================================================================
   LEAD CARD
================================================================= */
const LeadCard = ({ lead, onView, onEdit, onDelete }) => {
  const probability = Math.max(0, Math.min(100, Number(lead.probability || 0)));

  return (
    <article className="ll-card" onClick={() => onView(lead.id)}>
      <div className="ll-card-top">
        <div className="ll-person">
          <div className="ll-avatar" style={{ background: avatarColor(lead.name) }}>
            {initials(lead.name) || "L"}
          </div>
          <div className="ll-person-text">
            <h3>{lead.name || "-"}</h3>
            <span>{lead.jobTitle || lead.source || "Lead"}</span>
          </div>
        </div>
        <Badge status={lead.status} />
      </div>

      <div className="ll-company">
        <Icon type="company" />
        <span>{lead.companyName || "No company"}</span>
      </div>

      <div className="ll-card-grid">
        <div className="ll-info-box">
          <span><Icon type="mail" /> Email</span>
          <strong title={lead.email || ""}>{lead.email || "-"}</strong>
        </div>

        <div className="ll-info-box">
          <span><Icon type="money" /> Budget</span>
          <strong>{formatBudget(lead.budget)}</strong>
        </div>

        <div className="ll-info-box">
          <span>Deal Stage</span>
          <strong>{lead.dealStage || "-"}</strong>
        </div>

        <div className="ll-info-box">
          <span><Icon type="calendar" /> Created</span>
          <strong>{formatDate(lead.createdAt)}</strong>
        </div>
      </div>

      <div className="ll-progress-wrap">
        <div className="ll-progress-head">
          <span>Close Probability</span>
          <strong>{probability}%</strong>
        </div>
        <div className="ll-progress-track">
          <div className="ll-progress-fill" style={{ width: `${probability}%` }} />
        </div>
      </div>

      <div className="ll-actions" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="ll-action view" onClick={() => onView(lead.id)}>
          View
        </button>
        <button type="button" className="ll-action edit" onClick={() => onEdit(lead.id)}>
          Edit
        </button>
        <button type="button" className="ll-action delete" onClick={() => onDelete(lead.id)}>
          Delete
        </button>
      </div>
    </article>
  );
};

/* =================================================================
   MAIN COMPONENT
================================================================= */
const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadService.getAllLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError("Failed to fetch leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("Failed to delete lead");
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesSearch =
        (lead.name || "").toLowerCase().includes(q) ||
        (lead.email || "").toLowerCase().includes(q) ||
        (lead.companyName || "").toLowerCase().includes(q) ||
        (lead.source || "").toLowerCase().includes(q) ||
        (lead.dealStage || "").toLowerCase().includes(q);

      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const stats = useMemo(
    () => [
      { label: "Total", value: leads.length, accent: "#6366f1" },
      { label: "New", value: leads.filter((l) => l.status === "NEW").length, accent: "#2563eb" },
      { label: "Qualified", value: leads.filter((l) => l.status === "QUALIFIED").length, accent: "#0d9488" },
      { label: "Won", value: leads.filter((l) => l.status === "WON").length, accent: "#16a34a" },
    ],
    [leads]
  );

  return (
    <div className="ll-page">
      <style>{leadListCardCss}</style>

      <div className="ll-header">
        <div>
          <span className="ll-eyebrow">CRM Workspace</span>
          <h1>Leads</h1>
          <p>{loading ? "Loading…" : `${leads.length} total leads`}</p>
        </div>

        <button onClick={() => navigate("/leads/create")} className="ll-primary-btn" type="button">
          + Add Lead
        </button>
      </div>

      <div className="ll-toolbar">
        <div className="ll-search">
          <Icon type="search" />
          <input
            type="text"
            placeholder="Search by name, email, company, source, or deal stage…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} title="Clear" type="button">
              ✕
            </button>
          )}
        </div>

        <div className="ll-filter">
          <Icon type="filter" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </select>
        </div>

        <button type="button" onClick={fetchLeads} className="ll-refresh-btn">
          <Icon type="refresh" /> Refresh
        </button>
      </div>

      {error && (
        <div className="ll-error">
          <span>{error}</span>
          <button onClick={fetchLeads} type="button">Retry</button>
        </div>
      )}

      {!error && (
        <div className="ll-stats-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="ll-skeleton ll-stat-skeleton" />)
            : stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      )}

      {loading ? (
        <div className="ll-card-grid-wrap">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ll-empty">
          <h2>{searchTerm || statusFilter !== "ALL" ? "No matching leads" : "No leads found"}</h2>
          <p>{searchTerm || statusFilter !== "ALL" ? "Try a different search or filter." : "Get started by creating one."}</p>
          <button onClick={() => navigate("/leads/create")} type="button">
            Create your first lead →
          </button>
        </div>
      ) : (
        <>
          <div className="ll-card-grid-wrap">
            {filtered.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onView={(leadId) => navigate(`/leads/${leadId}`)}
                onEdit={(leadId) => navigate(`/leads/${leadId}/edit`)}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="ll-footer-count">
            Showing {filtered.length} of {leads.length} leads
          </div>
        </>
      )}
    </div>
  );
};

export default LeadList;

const leadListCardCss = `
.ll-page{--ll-bg:var(--bg,#f6f8fb);--ll-card:var(--card,#fff);--ll-card2:var(--card-2,#fcfcfd);--ll-text:var(--text,#101828);--ll-muted:var(--muted,#667085);--ll-border:var(--border,#eaecf0);--ll-primary:var(--primary,#155eef);--ll-danger:var(--danger,#b42318);--ll-warning:var(--warning,#b54708);min-height:100vh;background:var(--ll-bg);color:var(--ll-text);padding-bottom:40px}

.ll-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:18px}
.ll-eyebrow{display:block;color:var(--ll-primary);font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:650;margin-bottom:6px}
.ll-header h1{font-size:30px;line-height:1.15;letter-spacing:-.035em;margin:0;font-weight:650}
.ll-header p{margin:7px 0 0;color:var(--ll-muted);font-size:14px}

.ll-primary-btn{height:42px;border:0;border-radius:12px;padding:0 17px;color:#fff;font-weight:650;cursor:pointer;background:linear-gradient(90deg,#4f46e5,#7c3aed);box-shadow:0 10px 22px rgba(79,70,229,.22);transition:.2s ease}
.ll-primary-btn:hover{transform:translateY(-1px);opacity:.94}

.ll-toolbar{display:flex;align-items:center;gap:12px;background:var(--ll-card);border:1px solid var(--ll-border);border-radius:16px;padding:14px;margin-bottom:18px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.ll-search{flex:1;min-width:260px;height:42px;border:1px solid var(--ll-border);border-radius:11px;background:var(--ll-card);display:flex;align-items:center;gap:10px;padding:0 12px;color:var(--ll-muted)}
.ll-search input{width:100%;border:0;outline:0;background:transparent;color:var(--ll-text);font:inherit;font-size:14px}
.ll-search button{border:0;background:transparent;color:var(--ll-muted);cursor:pointer}

.ll-filter{height:42px;border:1px solid var(--ll-border);border-radius:11px;background:var(--ll-card);display:flex;align-items:center;gap:8px;padding:0 12px;color:var(--ll-muted)}
.ll-filter select{border:0;outline:0;background:transparent;color:var(--ll-text);font-weight:600}

.ll-refresh-btn{height:42px;border:1px solid var(--ll-border);border-radius:11px;background:var(--ll-card);color:var(--ll-text);display:inline-flex;align-items:center;gap:8px;padding:0 13px;font-weight:650;cursor:pointer}

.ll-error{display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(244,63,94,.1);color:var(--ll-danger);border:1px solid rgba(244,63,94,.25);padding:13px 14px;border-radius:14px;font-size:14px;margin-bottom:18px}
.ll-error button{border:0;background:transparent;color:var(--ll-danger);font-weight:650;text-decoration:underline;cursor:pointer}

.ll-stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:18px}
.ll-stat-card{position:relative;overflow:hidden;background:var(--ll-card);border:1px solid var(--ll-border);border-radius:16px;padding:16px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.ll-stat-accent{position:absolute;left:0;top:0;width:4px;height:100%}
.ll-stat-card p{font-size:27px;line-height:1;margin:0;font-weight:600;letter-spacing:-.04em}
.ll-stat-card span{display:block;margin-top:7px;color:var(--ll-muted);font-size:13px;font-weight:600}

.ll-card-grid-wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}

.ll-card{background:var(--ll-card);border:1px solid var(--ll-border);border-radius:18px;padding:18px;box-shadow:0 1px 2px rgba(16,24,40,.04);cursor:pointer;transition:.22s ease;position:relative;overflow:hidden}
.ll-card:before{content:"";position:absolute;left:0;top:0;right:0;height:3px;background:linear-gradient(90deg,#155eef,#7c3aed,#16a34a)}
.ll-card:hover{transform:translateY(-3px);box-shadow:0 16px 38px rgba(16,24,40,.1)}

.ll-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
.ll-person{display:flex;align-items:center;gap:11px;min-width:0}
.ll-avatar{width:44px;height:44px;border-radius:13px;color:#fff;display:grid;place-items:center;font-weight:600;font-size:13px;flex:0 0 auto}
.ll-person-text{min-width:0}
.ll-person-text h3{font-size:16px;line-height:1.2;margin:0;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ll-person-text span{display:block;color:var(--ll-muted);font-size:12px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.ll-badge{display:inline-flex;align-items:center;height:25px;padding:0 9px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap}
.b-NEW{background:#eff4ff;color:#155eef}
.b-CONTACTED{background:#f4f3ff;color:#6941c6}
.b-QUALIFIED{background:#ccfbf1;color:#0f766e}
.b-NEGOTIATION{background:#fffaeb;color:#b54708}
.b-WON{background:#ecfdf3;color:#067647}
.b-LOST{background:#fef3f2;color:#b42318}
.b-LOW{background:#f2f4f7;color:#475467}

.ll-company{display:flex;align-items:center;gap:8px;color:var(--ll-muted);font-size:13px;font-weight:600;border-bottom:1px solid var(--ll-border);padding-bottom:13px;margin-bottom:13px}
.ll-company svg{color:var(--ll-primary);flex:0 0 auto}
.ll-company span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.ll-card-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ll-info-box{background:var(--ll-card2);border:1px solid var(--ll-border);border-radius:13px;padding:11px;min-width:0}
.ll-info-box span{display:flex;align-items:center;gap:6px;color:var(--ll-muted);font-size:11px;text-transform:uppercase;letter-spacing:.04em;font-weight:650;margin-bottom:6px}
.ll-info-box span svg{color:var(--ll-primary);width:15px;height:15px}
.ll-info-box strong{display:block;color:var(--ll-text);font-size:13px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.ll-progress-wrap{margin-top:14px}
.ll-progress-head{display:flex;justify-content:space-between;color:var(--ll-muted);font-size:12px;font-weight:650;margin-bottom:7px}
.ll-progress-head strong{color:var(--ll-text)}
.ll-progress-track{height:9px;background:var(--ll-border);border-radius:999px;overflow:hidden}
.ll-progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#155eef,#7c3aed);transition:width .45s ease}

.ll-actions{display:flex;gap:9px;margin-top:16px}
.ll-action{height:36px;border-radius:10px;font-size:13px;font-weight:650;cursor:pointer;flex:1;background:var(--ll-card);border:1px solid var(--ll-border)}
.ll-action.view{color:var(--ll-primary)}
.ll-action.edit{color:var(--ll-warning)}
.ll-action.delete{color:var(--ll-danger)}

.ll-empty{text-align:center;background:var(--ll-card);border:1px solid var(--ll-border);border-radius:18px;padding:58px 18px}
.ll-empty h2{font-size:19px;margin:0 0 6px}
.ll-empty p{color:var(--ll-muted);margin:0 0 16px}
.ll-empty button{border:0;background:transparent;color:var(--ll-primary);font-size:14px;font-weight:650;cursor:pointer}

.ll-footer-count{margin-top:16px;background:var(--ll-card);border:1px solid var(--ll-border);border-radius:12px;padding:12px 14px;color:var(--ll-muted);font-size:13px}

.ll-skeleton{position:relative;overflow:hidden;background:var(--ll-border);border-radius:12px}
.ll-skeleton:after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent);animation:ll-shimmer 1.25s infinite}
.ll-stat-skeleton{height:86px}
.ll-skeleton-card{height:330px}
.ll-sk-sm{height:22px;width:42%;margin-bottom:20px}
.ll-sk-title{height:28px;margin-bottom:14px}
.ll-sk-line{height:14px;margin-bottom:10px}
.ll-sk-line.short{width:70%}
.ll-sk-btn{height:38px;margin-top:28px}

@keyframes ll-shimmer{100%{transform:translateX(100%)}}

@media(max-width:1180px){
  .ll-card-grid-wrap{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ll-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}

@media(max-width:760px){
  .ll-header,.ll-toolbar{flex-direction:column;align-items:stretch}
  .ll-header h1{font-size:26px}
  .ll-primary-btn,.ll-refresh-btn{width:100%;justify-content:center}
  .ll-stats-grid,.ll-card-grid-wrap{grid-template-columns:1fr}
  .ll-card-grid{grid-template-columns:1fr}
  .ll-actions{flex-direction:column}
  .ll-search{min-width:0}
}
`;