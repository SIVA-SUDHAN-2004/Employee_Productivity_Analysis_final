import React, { useState } from "react";
import CSVUpload from "../components/Upload/CSVUpload.jsx";
import EmployeeTable from "../components/Employees/EmployeeTable.jsx";
import { useEmployee } from "../context/EmployeeContext.jsx";

const UploadPage = () => {
  const { employees, clearEmployees } = useEmployee();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    clearEmployees();
    setShowConfirm(false);
  };

  return (
    <div className="space-y-4">
      {/* Page header with Clear button */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Upload CSV</h1>
        {employees.length > 0 && (
          <div className="flex items-center gap-3">
            {showConfirm ? (
              <>
                <span className="text-xs text-slate-400">
                  Remove all {employees.length.toLocaleString()} records?
                </span>
                <button
                  onClick={handleClear}
                  className="text-xs px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors font-medium"
                >
                  Yes, clear all
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 border border-slate-700 transition-all"
              >
                🗑 Clear all data
              </button>
            )}
          </div>
        )}
      </div>

      <CSVUpload />

      {/* Table is only shown when there is data */}
      {employees.length > 0 && <EmployeeTable />}
    </div>
  );
};

export default UploadPage;
