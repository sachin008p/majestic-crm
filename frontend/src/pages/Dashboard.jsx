import React, { useState, useEffect } from "react";
import api from "../services/api";

const StatCard = ({ title, value, icon, color, loading }) => (
  <div className="glass rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
          {loading ? (
            <span className="inline-block w-16 h-8 bg-slate-200 animate-pulse rounded-lg" />
          ) : value}
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const statusColor = (status) => {
  const map = {
    NEW: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-yellow-100 text-yellow-700",
    NEGOTIATION: "bg-orange-100 text-orange-700",
    CLOSED_WON: "bg-emerald-100 text-emerald-700",
    CLOSED_LOST: "bg-rose-100 text-rose-700",
    ACTIVE: "bg-emerald-100 text-emerald-700",
    INACTIVE: "bg-slate-100 text-slate-600",
    PENDING: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    HIGH: "bg-rose-100 text-rose-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-slate-100 text-slate-600",
  };
  return map[status] || "bg-slate-100 text-slate-600";
};

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [leadsRes, customersRes, tasksRes] = await Promise.all([
          api.get("/api/leads"),
          api.get("/api/customers"),
          api.get("/api/tasks"),
        ]);
        setLeads(leadsRes.data);
        setCustomers(customersRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const closedWon = leads.filter((l) => l.status === "CLOSED_WON").length;
  const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;
  const activeCutomers = customers.filter((c) => c.status === "ACTIVE").length;

  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={leads.length}
          loading={loading}
          color="bg-indigo-50 text-indigo-500"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          title="Total Customers"
          value={customers.length}
          loading={loading}
          color="bg-emerald-50 text-emerald-500"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard
          title="Deals Closed"
          value={closedWon}
          loading={loading}
          color="bg-purple-50 text-purple-500"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          loading={loading}
          color="bg-amber-50 text-amber-500"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      </div>

      {/* Recent Leads + Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Leads */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Recent Leads</h2>
            <a href="/leads" className="text-sm text-indigo-500 hover:underline">View all</a>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          ) : recentLeads.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{lead.name}</p>
                    <p className="text-xs text-slate-400">{lead.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(lead.status)}`}>
                    {lead.status?.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Recent Tasks</h2>
            <a href="/tasks" className="text-sm text-indigo-500 hover:underline">View all</a>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          ) : recentTasks.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.leadName || "No lead"}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(task.status)}`}>
                      {task.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Customers */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Customers</h2>
          <a href="/customers" className="text-sm text-indigo-500 hover:underline">View all</a>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />)}
          </div>
        ) : customers.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No customers yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {customers.slice(0, 6).map((customer) => (
              <div key={customer.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                  {customer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-slate-800 text-sm truncate">{customer.name}</p>
                  <p className="text-xs text-slate-400 truncate">{customer.email}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}