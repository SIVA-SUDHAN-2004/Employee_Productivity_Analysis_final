import React, { useState } from "react";
import { useEmployee } from "../../context/EmployeeContext.jsx";
import Card from "../Common/Card.jsx";

const CSVUpload = () => {
  const { uploadCSV } = useEmployee();
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setMsg("");
    setError("");
    try {
      const data = await uploadCSV(file);
      // data = { insertedCount, employees }
      setMsg(`✓ Imported ${data.insertedCount} employee records successfully.`);
      setFile(null);
      // Reset the file input
      document.getElementById("csv-file-input").value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm text-slate-300 mb-1">
            Upload Employee CSV / Excel
          </label>
          <input
            id="csv-file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
          />
          {/* <p className="text-[11px] text-slate-500 mt-1">
            Columns: Employee_ID, Department, Gender, Age, Job_Title, Hire_Date, Years_At_Company, Education_Level, Performance_Score, Monthly_Salary, Work_Hours_Per_Week, Projects_Handled, Overtime_Hours, Sick_Days, Remote_Work_Frequency, Team_Size, Training_Hours, Promotions, Employee_Satisfaction_Score, Resigned
          </p> */}
        </div>
        <button
          type="submit"
          disabled={!file}
          className="px-4 py-2 rounded-full text-sm bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Upload &amp; Import
        </button>
      </form>

      {msg && (
        <div className="mt-3 text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/40 rounded-lg px-3 py-2">
          {msg}
        </div>
      )}
      {error && (
        <div className="mt-3 text-xs text-red-400 bg-red-900/30 border border-red-700/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
    </Card>
  );
};

export default CSVUpload;
