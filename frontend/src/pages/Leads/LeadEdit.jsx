import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadService } from '../../services/leadService';

const LeadEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'NEW',
    budget: '',
    notes: '',
    assignedToId: '',
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const lead = await leadService.getLead(id);
        setFormData({
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          source: lead.source || '',
          status: lead.status || 'NEW',
          budget: lead.budget ?? '',
          notes: lead.notes || '',
          assignedToId: lead.assignedToId ?? '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load lead');
      } finally {
        setFetching(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await leadService.updateLead(id, {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : null,
        assignedToId: formData.assignedToId ? Number(formData.assignedToId) : null,
      });
      navigate(`/leads/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-6 text-slate-500">Loading lead...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Edit Lead</h1>
        <button onClick={() => navigate(`/leads/${id}`)} className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-4 py-2 rounded-xl">
          Back
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">{error}</div>}

      <div className="glass rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            ['name', 'Full Name', 'text', true],
            ['email', 'Email Address', 'email', true],
            ['phone', 'Phone Number', 'tel', true],
            ['source', 'Lead Source', 'text', false],
            ['budget', 'Budget', 'number', false],
            ['assignedToId', 'Assigned User ID', 'number', false],
          ].map(([name, label, type, required]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}{required ? ' *' : ''}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white">
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm resize-none" />
          </div>

          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => navigate('/leads')} className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadEdit;
