import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const initials = (name = '') =>
  name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

const AVATAR_COLORS = ['#4f46e5','#7c3aed','#db2777','#0891b2','#16a34a','#d97706'];
const avatarColor = (name = '') => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

export default function Header() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  const menuRef = useRef(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    // persist to localStorage so it survives refresh
    localStorage.setItem('crm-theme', next ? 'dark' : 'light');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/leads?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const name = user?.name || user?.fullName || 'User';
  const email = user?.email || '';
  const role = user?.roles?.[0] || user?.role || user?.roleName || '';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl px-5 py-3 dark:border-slate-800 dark:bg-slate-950/80">
      {/* Left: Search */}
      <div className="relative hidden sm:block" style={{ minWidth: 220, maxWidth: 340, flex: 1 }}>
        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search leads, customers… (↵)"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {isDark ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.36-.71.71M5.64 18.36l-.71.71m12.02 0-.71-.71M5.64 5.64l-.71-.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-1 ring-white dark:ring-slate-950" />
        </button>

        {/* User avatar / dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
              style={{ background: avatarColor(name) }}
            >
              {initials(name)}
            </div>
            <div className="hidden text-left leading-tight md:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{name}</p>
              {role && <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{role}</p>}
            </div>
            <svg className="hidden h-4 w-4 text-slate-400 md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-black/10 dark:border-slate-700 dark:bg-slate-900">
              {/* User info header */}
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{name}</p>
                <p className="text-xs text-slate-400 truncate">{email}</p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {[
                  { label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', to: '/profile' },
                  { label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', to: '/settings' },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.to); setShowUserMenu(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 py-1 dark:border-slate-800">
                <button
                  onClick={() => { logout(); setShowUserMenu(false); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/20"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
