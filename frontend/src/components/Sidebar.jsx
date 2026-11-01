import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const links = [
  {
    section: "Workspace",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        badge: null,
      },
      {
        to: "/leads",
        label: "Leads",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        badge: "hot",
      },
      {
        to: "/customers",
        label: "Customers",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        badge: null,
      },
      {
        to: "/tasks",
        label: "Tasks",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
        badge: null,
      },
      {
        to: "/templates",
        label: "Templates",
        icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        badge: null,
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        to: "/profile",
        label: "Profile",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        badge: null,
      },
      {
        to: "/settings",
        label: "Settings",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
        badge: null,
      },
    ],
  },
];

const quickActions = [
  { label: "New Lead", to: "/leads/create", color: "#4f46e5" },
  { label: "New Task", to: "/tasks/create", color: "#7c3aed" },
  { label: "New Customer", to: "/customers/create", color: "#0891b2" },
];

const getInitials = (name = "User") =>
  name.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const name = user?.name || user?.fullName || "User";
  const role = user?.roles?.[0] || user?.role || user?.roleName || "";

  return (
    <aside
      className={`hidden md:flex h-screen shrink-0 flex-col border-r border-slate-200/70 bg-white text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[260px]"}`}
    >
      {/* ── Brand ────────────────────────────────── */}
      <div className="border-b border-slate-200/70 dark:border-slate-800 px-3 py-4 flex items-center justify-between gap-2">
        <div className={`flex items-center gap-3 min-w-0 overflow-hidden transition-all ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-base font-bold text-white shadow-lg shadow-indigo-600/20">
            M
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
              Majestic CRM
            </h1>
            <p className="truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Real Estate Workspace
            </p>
          </div>
        </div>
        {/* Collapse when not collapsed */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Collapse sidebar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
        {/* Expand when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="grid h-8 w-8 mx-auto place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Expand sidebar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Quick Actions ─────────────────────────── */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Quick Add</p>
          <div className="flex gap-1.5">
            {quickActions.map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="flex-1 rounded-xl py-1.5 text-[11px] font-bold text-white transition hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: a.color }}
              >
                +&nbsp;{a.label.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Navigation ───────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {links.map((group) => (
          <div key={group.section} className="mb-5 last:mb-0">
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {group.section}
              </p>
            )}

            <ul className="space-y-0.5">
              {group.items.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    title={collapsed ? link.label : undefined}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-300"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
                        )}

                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors ${
                            isActive
                              ? "bg-white text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/10"
                              : "bg-slate-100 text-slate-500 group-hover:text-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:group-hover:text-slate-300"
                          }`}
                        >
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.7}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                          </svg>
                        </span>

                        {!collapsed && (
                          <>
                            <span className="truncate">{link.label}</span>
                            {link.badge === "hot" && (
                              <span className="ml-auto shrink-0 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                HOT
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── User Card ────────────────────────────── */}
      <div className="border-t border-slate-200/70 p-3 dark:border-slate-800">
        {!collapsed ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
                {getInitials(name)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{name}</p>
                {role && (
                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">{role}</p>
                )}
              </div>

              <button
                onClick={logout}
                title="Sign out"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Collapsed: just avatar + logout */
          <div className="flex flex-col items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
              {getInitials(name)}
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
