import React, { useState, useEffect } from "react";
import api from "../services/api";


// ✅ Animated Counter Component
const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return <>{count}</>;
};

// ✅ Professional KPI Card
const StatCard = ({ title, value, icon, gradient, loading }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition duration-300 ${gradient}`}>
    <div className="absolute top-0 right-0 opacity-10 text-7xl">
      {icon}
    </div>

    <p className="text-sm opacity-80">{title}</p>
    <h2 className="text-3xl font-bold mt-2">
      {loading ? "..." : <AnimatedNumber value={value} />}
    </h2>
  </div>
);

// ✅ Status Color
const statusColor = (status) => {
  const map = {
    NEW: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-yellow-100 text-yellow-700",
    NEGOTIATION: "bg-orange-100 text-orange-700",
    WON: "bg-green-100 text-green-700",
    LOST: "bg-red-100 text-red-700",
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, customersRes, tasksRes] = await Promise.all([
        api.get("/api/leads"),
        api.get("/api/customers"),
        api.get("/api/tasks"),
      ]);
      setLeads(leadsRes.data);
      setCustomers(customersRes.data);
      setTasks(tasksRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closedWon = leads.filter((l) => l.status === "WON").length;
  const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;

  return (
    <div className="space-y-8 pb-10 animate-fade-in">

      {/* ✅ Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-sm text-slate-400">
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* ✅ KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={leads.length}
          loading={loading}
          gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
          icon="👥"
        />
        <StatCard
          title="Total Customers"
          value={customers.length}
          loading={loading}
          gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
          icon="🏢"
        />
        <StatCard
          title="Deals Closed"
          value={closedWon}
          loading={loading}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          icon="✅"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          loading={loading}
          gradient="bg-gradient-to-r from-amber-500 to-amber-600"
          icon="📋"
        />
      </div>

      {/* ✅ Recent Leads */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>

        {leads.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No leads yet 🚀</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.email}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusColor(lead.status)}`}>
                  {lead.status?.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Recent Tasks */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>

        {tasks.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No tasks yet 📝</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-gray-400">{task.leadName || "No lead"}</p>
                </div>

                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${statusColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-full ${statusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
