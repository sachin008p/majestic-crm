import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/api/templates');
      setTemplates(response.data);
    } catch (err) {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await api.delete(`/api/templates/${id}`);
        setTemplates(templates.filter(t => t.id !== id));
      } catch (err) {
        setError('Failed to delete template');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-slate-500 text-lg">Loading...</div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-xs text-[var(--muted)]">Manage automated email contents</p>
        </div>
        <Link
          to="/templates/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-all shadow-sm shadow-indigo-600/20"
        >
          + Add Template
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        {templates.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No templates found. Create one to get started.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {templates.map((template) => (
              <div key={template.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{template.name}</h3>
                  <p className="text-xs text-slate-500">Subject: {template.subject}</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/templates/${template.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
