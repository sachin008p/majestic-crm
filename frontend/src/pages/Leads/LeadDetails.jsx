import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadService } from '../../services/leadService';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLead(await leadService.getLead(id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load lead');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  if (loading) return <div className="p-6 text-slate-500">Loading lead...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!lead) return <div className="p-6 text-slate-500">Lead not found.</div>;

  const fields = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Source', lead.source || '-'],
    ['Budget', lead.budget ? Number(lead.budget).toLocaleString('en-IN') : '-'],
    ['Status', lead.status],
    ['Assigned To', lead.assignedToName || 'Unassigned'],
    ['Created At', lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '-'],
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Lead Details</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/leads')} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600">Back</button>
          <button onClick={() => navigate(`/leads/${id}/edit`)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Edit</button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(([label, value]) => (
            <div key={label} className="border-b border-slate-100 pb-3">
              <p className="text-xs uppercase text-slate-400 font-semibold">{label}</p>
              <p className="text-sm text-slate-800 mt-1">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-xs uppercase text-slate-400 font-semibold">Notes</p>
          <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{lead.notes || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
