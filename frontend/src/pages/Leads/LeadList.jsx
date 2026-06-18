import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../../services/leadService';

const statusStyles = {
  NEW: { background: '#dbeafe', color: '#1e40af' },
  CONTACTED: { background: '#fef3c7', color: '#854d0e' },
  QUALIFIED: { background: '#d1fae5', color: '#166534' },
  NEGOTIATION: { background: '#ede9fe', color: '#6b21a8' },
  CLOSED_WON: { background: '#d1fae5', color: '#065f46' },
  CLOSED_LOST: { background: '#fee2e2', color: '#991b1b' },
};

const formatBudget = (budget) => {
  if (!budget) return '-';
  const num = typeof budget === 'number' ? budget : parseFloat(budget);
  return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAllLeads();
      setLeads(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } catch {
        alert('Failed to delete lead');
      }
    }
  };

  const filtered = leads.filter((lead) =>
    (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.source || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
        <button
          onClick={() => navigate('/leads/create')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
        >
          + Add Lead
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or source..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm">
          {error}
          <button onClick={fetchLeads} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: leads.length, color: '#6366f1' },
          { label: 'New', value: leads.filter(l => l.status === 'NEW').length, color: '#2563eb' },
          { label: 'Qualified', value: leads.filter(l => l.status === 'QUALIFIED').length, color: '#059669' },
          { label: 'Closed Won', value: leads.filter(l => l.status === 'CLOSED_WON').length, color: '#065f46' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg mb-2">No leads found</p>
          <button onClick={() => navigate('/leads/create')} className="text-indigo-500 text-sm hover:underline">
            Create your first lead →
          </button>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Name', 'Email', 'Phone', 'Source', 'Budget', 'Status', 'Assigned To', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm">{lead.name || '-'}</td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{lead.email || '-'}</td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{lead.phone || '-'}</td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{lead.source || '-'}</td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{formatBudget(lead.budget)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={statusStyles[lead.status] || { background: '#f3f4f6', color: '#1f2937' }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{lead.assignedToName || 'Unassigned'}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-3">
                        <button onClick={() => navigate(`/leads/${lead.id}`)} className="text-indigo-500 text-sm font-medium hover:underline">View</button>
                        <button onClick={() => navigate(`/leads/${lead.id}/edit`)} className="text-amber-500 text-sm font-medium hover:underline">Edit</button>
                        <button onClick={() => handleDelete(lead.id)} className="text-red-500 text-sm font-medium hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;