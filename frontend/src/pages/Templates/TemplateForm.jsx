import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function TemplateForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchTemplate();
    }
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const res = await api.get(`/api/templates/${id}`);
      setFormData({
        name: res.data.name,
        subject: res.data.subject,
        body: res.data.body,
      });
    } catch (err) {
      setError('Failed to load template details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/api/templates/${id}`, formData);
      } else {
        await api.post('/api/templates', formData);
      }
      navigate('/templates');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save template');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-10 text-slate-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-center bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{isEdit ? 'Edit Template' : 'New Template'}</h1>
        </div>
        <button
          onClick={() => navigate('/templates')}
          className="text-slate-500 hover:text-slate-700 text-sm font-medium"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Template Name (e.g., WELCOME_EMAIL)</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Body</label>
          <textarea
            required
            rows={8}
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Type your email content here. You can use variables like {customer_name} if supported by backend."
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold transition-all mt-4"
        >
          {saving ? 'Saving...' : 'Save Template'}
        </button>
      </form>
    </div>
  );
}
