import React, { useState } from "react";
import { uploadCSVApi } from "../../api/employeeApi.js";
import Card from "../Common/Card.jsx";

const CSVUpload = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) return;
  setLoading(true);
  setMsg("");
  try {
    const res = await uploadCSVApi(file);
    // 👇 res.data is { insertedCount, sample }
    const sample = res.data.sample || [];
    onUploaded?.(sample);
    setMsg(`Uploaded ${res.data.insertedCount} employees`);
    setFile(null);
  } catch (err) {
    setMsg(err.response?.data?.message || "Upload failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm text-slate-300 mb-1">
            Upload Employee CSV
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Columns: employeeId, name, department, role, experienceYears, age, avgHoursPerDay,
            tasksCompletedPerWeek, overtimeHoursPerWeek, absentDaysPerMonth
          </p>
        </div>
        <button
          type="submit"
          disabled={!file || loading}
          className="px-4 py-2 rounded-full text-sm bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload & Import"}
        </button>
      </form>
      {msg && <div className="mt-2 text-xs text-slate-400">{msg}</div>}
    </Card>
  );
};

export default CSVUpload;
