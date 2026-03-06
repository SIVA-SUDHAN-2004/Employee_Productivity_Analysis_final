import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    localStorage.getItem("ep_user") ? JSON.parse(localStorage.getItem("ep_user")) : null
  );
  const [token, setToken] = useState(() => localStorage.getItem("ep_token"));
  const navigate = useNavigate();

  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("ep_user", JSON.stringify(user));
    localStorage.setItem("ep_token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ep_user");
    localStorage.removeItem("ep_token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
