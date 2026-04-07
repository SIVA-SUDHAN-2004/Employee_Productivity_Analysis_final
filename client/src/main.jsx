import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { EmployeeProvider } from "./context/EmployeeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/*
          EmployeeProvider must be inside AuthProvider so it can access
          the auth token from localStorage on mount (to auto-load employees).
        */}
        <EmployeeProvider>
          <App />
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
