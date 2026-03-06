import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">Profile</h1>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-sm">
        <div className="mb-3">
          <span className="text-slate-400 block">Name:</span>
          <span className="text-slate-200 font-medium">{user?.name}</span>
        </div>

        <div className="mb-3">
          <span className="text-slate-400 block">Email:</span>
          <span className="text-slate-200 font-medium">{user?.email}</span>
        </div>

        <div className="mb-3">
          <span className="text-slate-400 block">Organization:</span>
          <span className="text-slate-200 font-medium">{user?.organization}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
