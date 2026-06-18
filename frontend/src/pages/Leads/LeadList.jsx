import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../../services/leadService';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAllLeads();
      setLeads(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads. Please try again.');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      } catch (err) {
        console.error('Error deleting lead:', err);
        alert('Failed to delete lead');
      }
    }
  };

  const getStatusColor = (status) => {
    const map = {
      NEW: 'bg-blue-100 text-blue-800',
      CONTACTED: 'bg-yellow-100 text-yellow-800',
      QUALIFIED: 'bg-green-100 text-green-800',
      NEGOTIATION: 'bg-purple-100 text-purple-800',
      WON: 'bg-emerald-100 text-emerald-800',
      LOST: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const formatBudget = (budget) => {
    if (!budget) return '-';
    const num = typeof budget === 'number' ? budget : parseFloat(budget);
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const filtered = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.source && lead.source.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>Leads</h1>
        <button
          onClick={() => navigate('/leads/create')}
          style={{ background: '#6366f1', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
        >
          + Add Lead
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name, email, or source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: 400, padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {error}
          <button onClick={fetchLeads} style={{ marginLeft: 8, textDecoration: 'underline', background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
          <p style={{ fontSize: 18 }}>No leads found</p>
          <button
            onClick={() => navigate('/leads/create')}
            style={{ marginTop: 16, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            Create your first lead →
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Phone</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Source</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Budget</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Assigned To</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.15s' }}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>{lead.name}</td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>{lead.email}</td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>{lead.phone}</td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>{lead.source || '-'}</td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>{formatBudget(lead.budget)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600, display: 'inline-block', ...Object.fromEntries(Object.entries(getStatusColor(lead.status)).map(([k, v]) => [k, v]).map((kv, i) => { const parts = lead.status ? `bg-${lead.status.toLowerCase()}-100 text-${lead.status.toLowerCase()}-800`.split(' ') : []; return kv; })) }}>
                      <span style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: getStatusColor(lead.status).split(' ')[0].replace('bg-', '#').replace('blue-100', '#dbeafe').replace('yellow-100', '#fef3c7').replace('green-100', '#d1fae5').replace('purple-100', '#ede9fe').replace('emerald-100', '#d1fae5').replace('red-100', '#fee2e2').replace('gray-100', '#f3f4f6'), color: getStatusColor(lead.status).split(' ')[1].replace('text-', '#').replace('blue-800', '#1e40af').replace('yellow-800', '#854d0e').replace('green-800', '#166534').replace('purple-800', '#6b21a8').replace('emerald-800', '#065f46').replace('red-800', '#991b1b').replace('gray-800', '#1f2937') }}>
                        {lead.status}
                      </span>
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>{lead.assignedToName || 'Unassigned'}</td>
                  <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/leads/edit/${lead.id}`)}
                        style={{ color: '#d97706', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
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
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginTop: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#6366f1', margin: 0 }}>{leads.length}</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>Total Leads</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#059669', margin: 0 }}>{leads.filter((l) => l.status === 'QUALIFIED').length}</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>Qualified</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#2563eb', margin: 0 }}>{leads.filter((l) => l.status === 'NEW').length}</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>New</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#059669', margin: 0 }}>{leads.filter((l) => l.status === 'WON').length}</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>Won</p>
        </div>
      </div>
    </div>
  );
};

export default LeadList;
