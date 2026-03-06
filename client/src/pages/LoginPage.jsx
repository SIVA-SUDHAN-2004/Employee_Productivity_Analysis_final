import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginApi(form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-semibold mb-1 text-slate-50">
          Manager Login
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Access your employee productivity dashboard.
        </p>
        <form onSubmit={onSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-slate-300 mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          {error && <div className="text-xs text-rose-400">{error}</div>}
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-sm font-medium"
          >
            Login
          </button>
        </form>
        <p className="text-xs text-slate-500 mt-4">
          New manager?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
