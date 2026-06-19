import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TaskCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    assignedToId: '',
    leadId: '',
  });

  useEffect(() => {
    api.get('/api/leads').then(r => setLeads(r.data)).catch(() => {});
    api.get('/api/users').then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/tasks', {
        ...form,
        assignedToId: form.assignedToId ? Number(form.assignedToId) : null,
        leadId: form.leadId ? Number(form.leadId) : null,
      });
      navigate('/tasks');
    } catch (err) {
      console.log("Full error:", err.response?.data);
      setError(JSON.stringify(err.response?.data) || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Task</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{error}</div>
      )}

      <div className="glass rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To *</label>
            <select
              name="assignedToId"
              value={form.assignedToId}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select User --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Related Lead (Optional)</label>
            <select
              name="leadId"
              value={form.leadId}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- No Lead --</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 font-semibold transition-all"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="bg-slate-100 text-slate-700 px-6 py-2 rounded-xl hover:bg-slate-200 font-semibold transition-all"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskCreate;