import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEmployee } from "../../context/EmployeeContext.jsx";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import LoadingOverlay from "../Common/LoadingOverlay.jsx";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const { isLoading } = useEmployee();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Global loader — covers the entire app during any async action */}
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
