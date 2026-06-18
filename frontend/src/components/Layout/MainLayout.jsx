import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
