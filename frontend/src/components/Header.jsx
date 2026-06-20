import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
  const { logout } = useContext(AuthContext);
  return (
    <header className="glass sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-slate-200">
      <div className="flex items-center">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Majestic CRM</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
                    <input
            type="text"
            placeholder="Search leads..."
            className="w-64 pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-300"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        </button>
        <button
          onClick={logout}
          className="text-sm font-medium px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
