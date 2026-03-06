import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/80 backdrop-blur">
      <div className="text-sm text-slate-400">Manager Dashboard</div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-slate-100">{user?.name}</div>
          <div className="text-xs text-slate-500">{user?.email}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <button
          onClick={logout}
          className="text-xs px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
