import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiPieChart,
  FiRefreshCw,
  FiSettings,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AppFooter from "../components/ui/AppFooter";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: FiGrid },
  { path: "/transactions", label: "Transactions", icon: FiDollarSign },
  { path: "/recurring", label: "Recurring", icon: FiRefreshCw },
  { path: "/budgets", label: "Budgets", icon: FiPieChart },
  { path: "/categories", label: "Categories", icon: FiLayers },
  { path: "/tax-estimator", label: "Tax Estimator", icon: FiBarChart2 },
  { path: "/tax-calendar", label: "Tax Calendar", icon: FiCalendar },
  { path: "/reports", label: "Reports", icon: FiFileText },
  { path: "/settings", label: "Settings", icon: FiSettings },
];

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = user?.name || user?.email || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sidebar = (
    <>
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-200">
            TP
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              TaxPal
            </h1>
            <p className="text-xs text-slate-500">Personal Finance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {displayName}
            </p>
            {user?.country && (
              <p className="truncate text-xs text-slate-500">{user.country}</p>
            )}
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <FiLogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <FiX className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="flex flex-1 flex-col overflow-auto">
        <div className="sticky top-0 z-40 flex items-center border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-bold text-slate-900">TaxPal</span>
        </div>
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
        <AppFooter />
      </main>
    </div>
  );
};

export default MainLayout;
