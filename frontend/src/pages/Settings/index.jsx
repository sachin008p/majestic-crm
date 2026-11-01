import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { applyTheme } from '../../utils/theme';

/* ─── Icon helper ─────────────────────────────────────────── */
const Ico = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/* ─── Toggle switch ──────────────────────────────────────── */
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    aria-checked={checked}
    role="switch"
    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${checked ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

/* ─── Form field wrapper ─────────────────────────────────── */
const Field = ({ label, children, desc }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</label>
    {desc && <p className="text-xs text-slate-400 mb-2">{desc}</p>}
    {children}
  </div>
);

const inputCls = "w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm dark:text-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [company, setCompany] = useState({ name: '', email: '', phone: '', address: '', website: '' });
  const [notifications, setNotifications] = useState({ emailLeads: true, emailTasks: true, emailCustomers: false, taskReminders: true, leadUpdates: true });
  const [theme, setTheme] = useState('light');

  /* ── Users state ── */
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({ fullName: '', email: '', phone: '', password: '', roleName: 'SALES', isActive: true, reportingToId: '' });
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (activeTab === 'users') { loadUsers(); setEditingUser(null); }
  }, [activeTab]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleOpenUserForm = (user = null) => {
    setError(null);
    if (user) {
      setEditingUser(user);
      setUserFormData({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '', password: '', roleName: user.role || 'SALES', isActive: user.isActive !== undefined ? user.isActive : (user.active !== undefined ? user.active : true), reportingToId: user.reportingToId || '' });
    } else {
      setEditingUser({});
      setUserFormData({ fullName: '', email: '', phone: '', password: '', roleName: 'SALES', isActive: true, reportingToId: '' });
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...userFormData, reportingToId: userFormData.reportingToId || null };
      if (editingUser && editingUser.id && !payload.password) delete payload.password;
      if (editingUser && editingUser.id) {
        await api.put(`/api/users/${editingUser.id}`, payload);
      } else {
        await api.post('/api/users', payload);
      }
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user permanently?')) {
      try {
        await api.delete(`/api/users/${id}`);
        loadUsers();
        setEditingUser(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  /* ── Load settings on mount ── */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get('/api/settings');
        if (!res.data) return;
        const d = res.data;
        setCompany({ name: d.companyName || '', email: d.email || '', phone: d.phone || '', address: d.address || '', website: d.website || '' });
        setNotifications({ emailLeads: d.emailLeads ?? true, emailTasks: d.emailTasks ?? true, emailCustomers: d.emailCustomers ?? false, taskReminders: d.taskReminders ?? true, leadUpdates: d.leadUpdates ?? true });
        setTheme(applyTheme(d.theme));
      } catch (err) {
        console.error('Settings load failed:', err);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.post('/api/settings', {
        companyName: company.name, email: company.email, phone: company.phone,
        address: company.address, website: company.website,
        emailLeads: notifications.emailLeads, emailTasks: notifications.emailTasks,
        emailCustomers: notifications.emailCustomers, taskReminders: notifications.taskReminders,
        leadUpdates: notifications.leadUpdates, theme,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Save failed. Try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'theme', label: 'Appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'users', label: 'Users & Roles', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z' },
  ];

  const ROLE_COLORS = { ADMIN: '#ef4444', MANAGER: '#f59e0b', TEAM_LEADER: '#3b82f6', SALES: '#22c55e', SUPPORT: '#8b5cf6' };

  const filteredUsers = users.filter(u =>
    !userSearch || (u.fullName || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your workspace, team and preferences</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-sm px-4 py-2 rounded-xl font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Settings saved!
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12V16.5ZM10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0Z" /></svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="flex gap-5">
        {/* ── Sidebar nav ── */}
        <div className="w-48 shrink-0">
          <div className="glass rounded-2xl p-2 space-y-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab.id
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Ico d={tab.icon} size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content pane ── */}
        <div className="flex-1 glass rounded-2xl p-6 bg-white dark:bg-slate-900 min-h-[500px]">

          {/* ── Company ── */}
          {activeTab === 'company' && (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Company Information</h2>
                <p className="text-xs text-slate-400 mt-0.5">This information appears throughout the CRM.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', key: 'name', type: 'text', placeholder: 'Majestic Realities', desc: '' },
                  { label: 'Business Email', key: 'email', type: 'email', placeholder: 'contact@company.com', desc: '' },
                  { label: 'Phone Number', key: 'phone', type: 'text', placeholder: '+91 98765 43210', desc: '' },
                  { label: 'Website', key: 'website', type: 'url', placeholder: 'https://company.com', desc: '' },
                ].map(field => (
                  <Field key={field.key} label={field.label}>
                    <input
                      type={field.type}
                      value={company[field.key]}
                      placeholder={field.placeholder}
                      onChange={e => setCompany({ ...company, [field.key]: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                ))}
              </div>
              <Field label="Office Address">
                <textarea
                  value={company.address}
                  placeholder="Full office address…"
                  rows={3}
                  onChange={e => setCompany({ ...company, address: e.target.value })}
                  className={inputCls + " resize-none"}
                />
              </Field>
              <button onClick={handleSave} disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                {saving ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> Saving…</> : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Notification Preferences</h2>
                <p className="text-xs text-slate-400 mt-0.5">Choose when you receive email alerts.</p>
              </div>
              {[
                { key: 'emailLeads', label: 'New Lead Notifications', desc: 'Email when a new lead is added to the system' },
                { key: 'emailTasks', label: 'Task Assignments', desc: 'Email when a task is assigned to you' },
                { key: 'emailCustomers', label: 'Customer Updates', desc: 'Email when customer information changes' },
                { key: 'taskReminders', label: 'Task Due Reminders', desc: 'Remind 24 hours before a task is due' },
                { key: 'leadUpdates', label: 'Lead Status Changes', desc: 'Notify when a lead moves to a new stage' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle checked={notifications[item.key]} onChange={v => setNotifications({ ...notifications, [item.key]: v })} />
                </div>
              ))}
              <button onClick={handleSave} disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold transition-all">
                {saving ? 'Saving…' : '💾 Save Preferences'}
              </button>
            </div>
          )}

          {/* ── Appearance ── */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Appearance</h2>
                <p className="text-xs text-slate-400 mt-0.5">Choose your preferred color theme.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'light', label: 'Light Mode', preview: ['bg-white', 'bg-slate-100', 'bg-indigo-500'], desc: 'Clean and bright interface' },
                  { id: 'dark', label: 'Dark Mode', preview: ['bg-slate-900', 'bg-slate-800', 'bg-indigo-500'], desc: 'Easy on the eyes at night' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(applyTheme(t.id))}
                    className={`p-5 rounded-2xl border-2 transition-all text-left ${theme === t.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                  >
                    <div className={`rounded-xl p-4 mb-3 ${t.id === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} border ${t.id === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                      <div className="flex gap-2 mb-2">
                        {t.preview.map((bg, i) => (
                          <div key={i} className={`${bg} rounded h-2 flex-1`} />
                        ))}
                      </div>
                      <div className={`${t.id === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} rounded h-1.5 w-3/4`} />
                    </div>
                    <p className={`text-sm font-bold ${theme === t.id ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>{t.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{t.desc}</p>
                    {theme === t.id && <span className="mt-2 inline-block text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">✓ Active</span>}
                  </button>
                ))}
              </div>
              <button onClick={handleSave} disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold transition-all">
                {saving ? 'Saving…' : '💾 Save Appearance'}
              </button>
            </div>
          )}

          {/* ── Users ── */}
          {activeTab === 'users' && !editingUser && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Team Members</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{users.length} users in your workspace</p>
                </div>
                <button
                  onClick={() => handleOpenUserForm()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  + Add User
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" /></svg>
                <input className={inputCls + " pl-10"} placeholder="Search by name, email, role…" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              </div>

              <div className="space-y-2">
                {usersLoading ? (
                  <div className="text-center py-8 text-slate-400">
                    <svg className="w-6 h-6 animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                    Loading users…
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    {userSearch ? 'No users match your search.' : 'No users found. Click "Add User" to create one.'}
                  </div>
                ) : (
                  filteredUsers.map(u => {
                    const isUserActive = u.active !== undefined ? u.active : u.isActive;
                    const roleColor = ROLE_COLORS[u.role] || '#6b7280';
                    const userInitials = (u.fullName || u.email || 'U').charAt(0).toUpperCase();
                    return (
                      <div key={u.id} className={`flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-sm transition-all ${!isUserActive ? 'opacity-60' : ''}`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 text-sm" style={{ background: roleColor }}>
                          {userInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {u.fullName || 'No Name'}
                            </p>
                            {u.reportingToName && (
                              <span className="text-xs text-slate-400">↑ {u.reportingToName}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{u.email} {u.phone ? `• ${u.phone}` : ''}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${roleColor}18`, color: roleColor }}>
                            {u.role || 'NO_ROLE'}
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isUserActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                            {isUserActive ? '● Active' : '○ Disabled'}
                          </span>
                          <button onClick={() => handleOpenUserForm(u)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm font-semibold ml-1 transition-colors">
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ── User Form ── */}
          {activeTab === 'users' && editingUser && (
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    {editingUser.id ? 'Edit User' : 'Create New User'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{editingUser.id ? 'Update user details and role.' : 'Add a new team member to your workspace.'}</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm flex items-center gap-1 transition-colors">
                  ← Back to list
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input type="text" required placeholder="John Smith" value={userFormData.fullName} onChange={e => setUserFormData({ ...userFormData, fullName: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Email Address">
                    <input type="email" required placeholder="john@company.com" value={userFormData.email} onChange={e => setUserFormData({ ...userFormData, email: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Phone Number">
                    <input type="text" required placeholder="+91 98765 43210" value={userFormData.phone} onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label={editingUser.id ? 'Password (leave blank to keep)' : 'Password'}>
                    <input type="password" required={!editingUser.id} placeholder={editingUser.id ? '••••••••' : 'Min 8 characters'} value={userFormData.password} onChange={e => setUserFormData({ ...userFormData, password: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Role">
                    <select value={userFormData.roleName} onChange={e => setUserFormData({ ...userFormData, roleName: e.target.value })} className={inputCls}>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="TEAM_LEADER">TEAM LEADER</option>
                      <option value="SALES">SALES</option>
                      <option value="SUPPORT">SUPPORT</option>
                    </select>
                  </Field>
                  <Field label="Reports To (Manager)">
                    <select value={userFormData.reportingToId} onChange={e => setUserFormData({ ...userFormData, reportingToId: e.target.value })} className={inputCls}>
                      <option value="">— No Manager —</option>
                      {users.filter(u => u.id !== editingUser.id).map(u => (
                        <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <Toggle checked={userFormData.isActive} onChange={v => setUserFormData({ ...userFormData, isActive: v })} />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Account Active</p>
                    <p className="text-xs text-slate-400">{userFormData.isActive ? 'User can log in and access the CRM' : 'User login is disabled'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
                  {editingUser && editingUser.id && (
                    <button type="button" onClick={() => handleDeleteUser(editingUser.id)} className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors">
                      🗑 Delete User
                    </button>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white transition-colors flex items-center gap-2">
                      {saving ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> Saving…</> : '💾 Save User'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ── Security ── */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Security</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage access and authentication settings.</p>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', badge: 'Coming Soon', icon: '🔐' },
                  { title: 'Session Management', desc: 'View and revoke active sessions across devices.', badge: 'Coming Soon', icon: '📱' },
                  { title: 'Audit Logs', desc: 'Track all user actions and data changes.', badge: 'Coming Soon', icon: '📋' },
                  { title: 'IP Allowlist', desc: 'Restrict login access to trusted IP addresses only.', badge: 'Coming Soon', icon: '🛡️' },
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <div className="text-2xl shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 shrink-0">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}