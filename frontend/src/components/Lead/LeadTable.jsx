import React, { useState, useEffect } from "react";
import api from "../services/api";

const getStatusColor = (status) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-700";
    case "CONTACTED":
      return "bg-yellow-100 text-yellow-700";
    case "NEGOTIATION":
      return "bg-orange-100 text-orange-700";
    case "CLOSED_WON":
      return "bg-green-100 text-green-700";
    case "CLOSED_LOST":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function LeadTable() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass rounded-2xl overflow-hidden animate-slide-up"
      style={{ animationDelay: "400ms" }}
    >
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Recent Leads
          </h3>
          <p className="text-sm text-slate-500">
            A list of all the recent leads in your account.
          </p>
        </div>

        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-500 transition-colors">
          Add Lead
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                Lead Name
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                Email
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                Budget
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                Status
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                Date Added
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  No Leads Found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {lead.name?.charAt(0)}
                      </div>

                      <span className="font-medium text-slate-800">
                        {lead.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {lead.email}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    ₹{lead.budget?.toLocaleString() || 0}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {lead.createdAt
                      ? new Date(
                          lead.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}