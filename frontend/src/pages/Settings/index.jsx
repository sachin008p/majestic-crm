import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [saved, setSaved] = useState(false);

  const [company, setCompany] = useState({
    name: 'Majestic Realities',
    email: 'info@majesticrealities.com',
    phone: '+91 11111111111',
    address: 'Mumbai, Maharashtra, India',
    website: 'www.majesticrealities.com',
  });

  const [notifications, setNotifications] = useState({
    emailLeads: true,
    emailTasks: true,
    emailCustomers: false,
    taskReminders: true,
    leadUpdates: true,
  });
  
  const [theme, setTheme] = useState("light");
  
  
  useEffect(() => {

    const loadSettings = async () => {
      try {

        const res = await api.get("/api/settings");

        if (!res.data) return;

        const data = res.data;

        setCompany({
          name: data.companyName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          website: data.website || "",
        });

        setNotifications({
          emailLeads: data.emailLeads ?? true,
          emailTasks: data.emailTasks ?? true,
          emailCustomers: data.emailCustomers ?? false,
          taskReminders: data.taskReminders ?? true,
          leadUpdates: data.leadUpdates ?? true,
        });

        setTheme(data.theme || "light");

      } catch (err) {
        console.error(err);
      }
    };

    loadSettings();

  }, []);

  const handleSave = async () => {
    try {
      await api.post("/api/settings", {
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

      setTimeout(() => {
        setSaved(false);
      }, 3000);

    } catch (error) {
      console.error("Settings save failed:", error);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'theme', label: 'Appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm px-4 py-2 rounded-xl font-medium">
            ✓ Settings saved!
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 shrink-0">
          <div className="glass rounded-2xl p-3 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/10 text-indigo-600'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
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
        <div className="flex-1 glass rounded-2xl p-6">

          {/* Company */}
          {activeTab === 'company' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Company Information</h2>
              {[
                { label: 'Company Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone', type: 'text' },
                { label: 'Address', key: 'address', type: 'text' },
                { label: 'Website', key: 'website', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={company[field.key]}
                    onChange={e => setCompany({ ...company, [field.key]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 rounded-xl font-semibold transition-all mt-2"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Notification Preferences</h2>
              {[
                { key: 'emailLeads', label: 'New Lead Notifications', desc: 'Email when a new lead is added' },
                { key: 'emailTasks', label: 'Task Notifications', desc: 'Email when a task is assigned to you' },
                { key: 'emailCustomers', label: 'Customer Updates', desc: 'Email when customer info changes' },
                { key: 'taskReminders', label: 'Task Reminders', desc: 'Remind before task due date' },
                { key: 'leadUpdates', label: 'Lead Status Updates', desc: 'Notify when lead status changes' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
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
              <button onClick={handleSave} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 rounded-xl font-semibold transition-all mt-2">
                Save Changes
              </button>
            </div>
          )}

          {/* Theme */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Appearance</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'light', label: 'Light Mode', bg: 'bg-white', text: 'text-slate-800', border: 'border-slate-200' },
                  { id: 'dark', label: 'Dark Mode', bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-700' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
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
              <button onClick={handleSave} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 rounded-xl font-semibold transition-all mt-2">
                Save Changes
              </button>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4">User Management</h2>
              <div className="space-y-3">
                {[
                  { name: 'System Admin', email: 'admin@majesticrealities.com', role: 'ADMIN', id: 1 },
                  { name: 'Admin User', email: 'admin@majestic.com', role: 'ADMIN', id: 3 },
                  { name: 'Admin', email: 'newadmin@test.com', role: 'ADMIN', id: 5 },
                ].map(u => (
                  <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 text-center">New users register karne ke liye Login page ka register API use karo</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}