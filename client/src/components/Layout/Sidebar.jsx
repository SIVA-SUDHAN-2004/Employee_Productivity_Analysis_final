import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg text-sm font-medium ${
    isActive ? "bg-slate-800 text-indigo-400" : "text-slate-300 hover:bg-slate-900"
  }`;

const Sidebar = () => {
  const { user } = useAuth();
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 hidden md:flex flex-col p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-indigo-400">Productivity Desk</h1>
        <p className="text-xs text-slate-500 mt-1">{user?.organization}</p>
      </div>
      <nav className="space-y-1 flex-1">
        <NavLink to="/" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/upload" className={linkClass}>Upload CSV</NavLink>
        <NavLink to="/employees" className={linkClass}>Employees</NavLink>
        <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </nav>
      <p className="text-[10px] text-slate-600 mt-4">© {new Date().getFullYear()} Productivity Suite</p>
    </aside>
  );
};

export default Sidebar;
