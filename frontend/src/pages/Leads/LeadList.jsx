import React, { useEffect, useState, useMemo } from "react";
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

const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#0891b2", "#16a34a", "#d97706", "#4f46e5"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const formatBudget = (budget) => {
  if (budget === null || budget === undefined || budget === "") return "-";
  const num = typeof budget === "number" ? budget : parseFloat(budget);
  if (isNaN(num)) return "-";
  return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

/* Status → CSS badge class (defined in index.css, dark-mode aware) */
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

const Badge = ({ status }) => (
  <span className={`badge ${statusClass(status)}`}>{status || "-"}</span>
);

/* =================================================================
   SKELETON (loading state)
================================================================= */
const Skeleton = ({ className = "" }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

const TableSkeleton = () => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

/* =================================================================
   STAT CARD (mini KPI)
================================================================= */
const StatCard = ({ label, value, accent }) => (
  <div className="relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 shadow-sm">
    <div className="absolute left-0 top-0 h-full w-1" style={{ background: accent }} />
    <p className="text-2xl font-extrabold tracking-tight" style={{ color: accent }}>
      {value}
    </p>
    <p className="text-xs text-[var(--muted)] mt-1">{label}</p>
  </div>
);

/* =================================================================
   MAIN COMPONENT
================================================================= */
const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadService.getAllLeads();
      setLeads(data);
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

  /* derived counts — all real data */
  const filtered = useMemo(
    () =>
      leads.filter((lead) => {
        const q = searchTerm.toLowerCase();
        return (
          (lead.name || "").toLowerCase().includes(q) ||
          (lead.email || "").toLowerCase().includes(q) ||
          (lead.source || "").toLowerCase().includes(q)
        );
      }),
    [leads, searchTerm]
  );

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
    <div className="space-y-6 animate-fade-in pb-10 min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* ============ HEADER ============ */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {loading ? "Loading…" : `${leads.length} total leads`}
          </p>
        </div>
        <button
          onClick={() => navigate("/leads/create")}
          className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: "linear-gradient(90deg,#4f46e5,#7c3aed)" }}
        >
          + Add Lead
        </button>
      </div>

      {/* ============ SEARCH ============ */}
      <div className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 max-w-md focus-within:ring-2 focus-within:ring-[var(--primary)] transition">
        <span className="text-[var(--muted)]">🔍</span>
        <input
          type="text"
          placeholder="Search by name, email, or source…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm w-full text-[var(--text)] placeholder:text-[var(--muted)]"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-[var(--muted)] hover:text-[var(--text)] text-sm"
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {/* ============ ERROR ============ */}
      {error && (
        <div className="flex items-center justify-between bg-red-500/10 text-[var(--danger)] border border-[var(--danger)]/30 p-3 rounded-xl text-sm">
          <span>{error}</span>
          <button onClick={fetchLeads} className="font-semibold underline">Retry</button>
        </div>
      )}

      {/* ============ STATS ============ */}
      {!error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[78px]" />)
            : stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      )}

      {/* ============ TABLE ============ */}
      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
          <p className="text-lg font-semibold mb-1">
            {searchTerm ? "No matching leads" : "No leads found"}
          </p>
          <p className="text-sm text-[var(--muted)] mb-4">
            {searchTerm ? "Try a different search term." : "Get started by creating one."}
          </p>
          <button
            onClick={() => navigate("/leads/create")}
            className="text-[var(--primary)] text-sm font-semibold hover:underline"
          >
            Create your first lead →
          </button>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--card-2)] border-b border-[var(--border)]">
                  {["Name", "Email", "Phone", "Source", "Budget", "Status", "Assigned To", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="border-b border-[var(--border)] hover:bg-[var(--card-2)] cursor-pointer transition-colors"
                  >
                    {/* Name + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg grid place-items-center text-white font-bold text-xs shrink-0"
                          style={{ background: avatarColor(lead.name) }}
                        >
                          {initials(lead.name)}
                        </div>
                        <span className="font-semibold text-sm">{lead.name || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)] whitespace-nowrap">{lead.email || "-"}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)] whitespace-nowrap">{lead.phone || "-"}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)] whitespace-nowrap">{lead.source || "-"}</td>
                    <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">{formatBudget(lead.budget)}</td>
                    <td className="px-4 py-3"><Badge status={lead.status} /></td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)] whitespace-nowrap">
                      {lead.assignedToName || "Unassigned"}
                    </td>
                    {/* Actions */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-3 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="text-[var(--primary)] text-sm font-medium hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/leads/${lead.id}/edit`)}
                          className="text-[var(--warning)] text-sm font-medium hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-[var(--danger)] text-sm font-medium hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* footer count */}
          <div className="px-4 py-3 text-xs text-[var(--muted)] border-t border-[var(--border)]">
            Showing {filtered.length} of {leads.length} leads
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;
