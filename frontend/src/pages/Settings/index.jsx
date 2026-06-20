import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { applyTheme } from '../../utils/theme';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [company, setCompany] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  });

  const [notifications, setNotifications] = useState({
    emailLeads: true,
    emailTasks: true,
    emailCustomers: false,
    taskReminders: true,
    leadUpdates: true,
  });

  const [theme, setTheme] = useState('light');

  // --- Users State ---
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = list mode, {} = create mode, {...} = edit mode
  const [userFormData, setUserFormData] = useState({
    fullName: '', email: '', phone: '', password: '', roleName: 'SALES', isActive: true, reportingToId: ''
  });

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
      setEditingUser(null);
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users.');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleOpenUserForm = (user = null) => {
    setError(null);
    if (user) {
      setEditingUser(user);
      setUserFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '', // Blank for edit
        roleName: user.role || 'SALES',
        isActive: user.isActive !== undefined ? user.isActive : (user.active !== undefined ? user.active : true),
        reportingToId: user.reportingToId || ''
      });
    } else {
      setEditingUser({}); // Empty obj means Create new
      setUserFormData({
        fullName: '', email: '', phone: '', password: '', roleName: 'SALES', isActive: true, reportingToId: ''
      });
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...userFormData, reportingToId: userFormData.reportingToId || null };

      // Edit mode me agar password blank chhoda hai, to use payload se hata do
      // taaki backend accidentally password ko blank/null se overwrite na kare
      if (editingUser && editingUser.id && !payload.password) {
        delete payload.password;
      }

      if (editingUser && editingUser.id) {
        // Edit
        await api.put(`/api/users/${editingUser.id}`, payload);
      } else {
        // Create
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
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/users/${id}`);
        loadUsers();
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to delete user');
      }
    }
  }

  // Theme ko DOM pe apply karo
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get('/api/settings');
        if (!res.data) return;
        const data = res.data;

        setCompany({
          name: data.companyName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          website: data.website || '',
        });

        setNotifications({
          emailLeads: data.emailLeads ?? true,
          emailTasks: data.emailTasks ?? true,
          emailCustomers: data.emailCustomers ?? false,
          taskReminders: data.taskReminders ?? true,
          leadUpdates: data.leadUpdates ?? true,
        });

        const savedTheme = applyTheme(data.theme);
        setTheme(savedTheme);

      } catch (err) {
        console.error('Settings load failed:', err);
        setError('Settings load nahi ho sake. Page refresh karo.');
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.post('/api/settings', {
        companyName: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        website: company.website,
        emailLeads: notifications.emailLeads,
        emailTasks: notifications.emailTasks,
        emailCustomers: notifications.emailCustomers,
        taskReminders: notifications.taskReminders,
        leadUpdates: notifications.leadUpdates,
        theme,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Settings save failed:', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Save nahi ho saka. Dobara try karo.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'theme', label: 'Appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'users', label: 'Users & Hierarchy', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  const SaveButton = () => (
    <button
      onClick={handleSave}
      disabled={saving}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold transition-all mt-2"
    >
      {saving ? 'Saving...' : 'Save Changes'}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 dark:text-[var(--muted)]">Settings</h1>
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm px-4 py-2 rounded-xl font-medium">
            ✓ Settings saved!
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <div className="glass rounded-2xl p-3 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-indigo-500/10 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:text-white'
                  }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 glass rounded-2xl p-6 bg-white dark:bg-slate-900">

          {activeTab === 'company' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Company Information</h2>
              {[
                { label: 'Company Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone', type: 'text' },
                { label: 'Address', key: 'address', type: 'text' },
                { label: 'Website', key: 'website', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={company[field.key]}
                    onChange={e => setCompany({ ...company, [field.key]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:text-slate-100 dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <SaveButton />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Notification Preferences</h2>
              {[
                { key: 'emailLeads', label: 'New Lead Notifications', desc: 'Email when a new lead is added' },
                { key: 'emailTasks', label: 'Task Notifications', desc: 'Email when a task is assigned to you' },
                { key: 'emailCustomers', label: 'Customer Updates', desc: 'Email when customer info changes' },
                { key: 'taskReminders', label: 'Task Reminders', desc: 'Remind before task due date' },
                { key: 'leadUpdates', label: 'Lead Status Updates', desc: 'Notify when lead status changes' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key] ? 'bg-indigo-500' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key] ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              ))}
              <SaveButton />
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Appearance</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'light', label: 'Light Mode', bg: 'bg-white', border: 'border-slate-200' },
                  { id: 'dark', label: 'Dark Mode', bg: 'bg-slate-900', border: 'border-slate-700' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(applyTheme(t.id))}
                    className={`p-4 rounded-2xl border-2 transition-all ${theme === t.id ? 'border-indigo-500' : 'border-slate-200'}`}
                  >
                    <div className={`${t.bg} ${t.border} border rounded-xl p-3 mb-3`}>
                      <div className={`h-2 w-16 ${t.id === 'light' ? 'bg-slate-200' : 'bg-slate-600'} rounded mb-2`} />
                      <div className={`h-2 w-10 ${t.id === 'light' ? 'bg-slate-100' : 'bg-slate-700'} rounded`} />
                    </div>
                    <p className={`text-sm font-medium ${theme === t.id ? 'text-indigo-600' : 'text-slate-600'}`}>{t.label}</p>
                    {theme === t.id && <p className="text-xs text-indigo-400 mt-0.5">Active</p>}
                  </button>
                ))}
              </div>
              <SaveButton />
            </div>
          )}

          {activeTab === 'users' && !editingUser && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">User Management & Hierarchy</h2>
                <button
                  onClick={() => handleOpenUserForm()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  + Add User
                </button>
              </div>
              <div className="space-y-3">
                {usersLoading ? (
                  <div className="text-center py-4 text-slate-500">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No users found</div>
                ) : (
                  users.map(u => {
                    const isUserActive = u.active !== undefined ? u.active : u.isActive;
                    return (
                      <div key={u.id} className={`flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${!isUserActive ? 'opacity-60' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                          {u.fullName ? u.fullName.charAt(0) : (u.email ? u.email.charAt(0) : 'U')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                            {u.fullName || 'No Name'}
                            {u.reportingToName && <span className="text-xs text-slate-400 font-normal ml-2">→ Reports to: {u.reportingToName}</span>}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{u.email} • {u.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                            {u.role || 'NO_ROLE'}
                          </span>
                          <span className={`${isUserActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'} text-xs font-semibold px-2.5 py-1 rounded-full shrink-0`}>
                            {isUserActive ? 'Active' : 'Disabled'}
                          </span>
                          <button
                            onClick={() => handleOpenUserForm(u)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium ml-2"
                          >
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

          {activeTab === 'users' && editingUser && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editingUser.id ? 'Edit User' : 'Create New User'}</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4 border border-slate-200 dark:border-slate-600 p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Full Name</label>
                    <input type="text" required value={userFormData.fullName} onChange={e => setUserFormData({ ...userFormData, fullName: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Email</label>
                    <input type="email" required value={userFormData.email} onChange={e => setUserFormData({ ...userFormData, email: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Phone</label>
                    <input type="text" required value={userFormData.phone} onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Password</label>
                    <input type="password" required={!editingUser.id} placeholder={editingUser.id ? "Leave blank to keep same" : ""} value={userFormData.password} onChange={e => setUserFormData({ ...userFormData, password: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Role</label>
                    <select value={userFormData.roleName} onChange={e => setUserFormData({ ...userFormData, roleName: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="TEAM_LEADER">TEAM LEADER</option>
                      <option value="SALES">SALES</option>
                      <option value="SUPPORT">SUPPORT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Reporting To (Manager)</label>
                    <select value={userFormData.reportingToId} onChange={e => setUserFormData({ ...userFormData, reportingToId: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="">-- No Manager --</option>
                      {users.filter(u => u.id !== editingUser.id).map(u => (
                        <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isActive" checked={userFormData.isActive} onChange={e => setUserFormData({ ...userFormData, isActive: e.target.checked })} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-100">Account is Active</label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-600">
                  {editingUser && editingUser.id && (
                    <button type="button" onClick={() => handleDeleteUser(editingUser.id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors mr-auto">
                      Delete User
                    </button>
                  )}
                  <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors">
                    {saving ? 'Saving...' : 'Save User'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}