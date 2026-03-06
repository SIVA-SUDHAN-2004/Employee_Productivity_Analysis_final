import React, { useState } from "react";
import {
  updateEmployeeApi,
  deleteEmployeeApi,
  createEmployeeApi,
  predictOneApi,
  predictManyApi
} from "../../api/employeeApi.js";
import Card from "../Common/Card.jsx";

const emptyEmployee = {
  employeeId: "",
  name: "",
  department: "",
  role: "",
  experienceYears: "",
  age: "",
  avgHoursPerDay: "",
  tasksCompletedPerWeek: "",
  overtimeHoursPerWeek: "",
  absentDaysPerMonth: ""
};

const EmployeeTable = ({ employees, setEmployees }) => {
  const [newEmp, setNewEmp] = useState(emptyEmployee);
  const [saving, setSaving] = useState(false);
  const rows = Array.isArray(employees)
    ? employees
    : employees?.data || [];

  const handleInlineChange = (id, field, value) => {
    setEmployees((prev) =>
      prev.map((e) => (e._id === id ? { ...e, [field]: value } : e))
    );
  };

  const saveRow = async (emp) => {
    setSaving(true);
    try {
      const payload = {
        ...emp,
        experienceYears: Number(emp.experienceYears),
        age: Number(emp.age),
        avgHoursPerDay: Number(emp.avgHoursPerDay),
        tasksCompletedPerWeek: Number(emp.tasksCompletedPerWeek),
        overtimeHoursPerWeek: Number(emp.overtimeHoursPerWeek),
        absentDaysPerMonth: Number(emp.absentDaysPerMonth)
      };
      const res = await updateEmployeeApi(emp._id, payload);
      setEmployees((prev) => prev.map((e) => (e._id === emp._id ? res.data : e)));
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (id) => {
    await deleteEmployeeApi(id);
    setEmployees((prev) => prev.filter((e) => e._id !== id));
  };

  const addEmployee = async () => {
    const payload = {
      ...newEmp,
      experienceYears: Number(newEmp.experienceYears),
      age: Number(newEmp.age),
      avgHoursPerDay: Number(newEmp.avgHoursPerDay),
      tasksCompletedPerWeek: Number(newEmp.tasksCompletedPerWeek),
      overtimeHoursPerWeek: Number(newEmp.overtimeHoursPerWeek),
      absentDaysPerMonth: Number(newEmp.absentDaysPerMonth)
    };
    const res = await createEmployeeApi(payload);
    setEmployees((prev) => [res.data, ...prev]);
    setNewEmp(emptyEmployee);
  };

  const predictOne = async (id) => {
    const res = await predictOneApi(id);
    setEmployees((prev) => prev.map((e) => (e._id === id ? res.data : e)));
  };

 const predictAll = async () => {
  const ids = rows.map((e) => e._id);
  const res = await predictManyApi(ids);
  const map = Object.fromEntries(res.data.map((e) => [e._id, e]));
  setEmployees((prev) => {
    const base = Array.isArray(prev) ? prev : prev?.data || [];
    return base.map((e) => map[e._id] || e);
  });
};


  return (
    <Card className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-slate-200">
  Employees ({rows.length})
</h2>

        <button
          onClick={predictAll}
          className="text-xs px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600"
        >
          Predict Productivity for All
        </button>
      </div>

      {/* New row */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        {Object.keys(emptyEmployee).map((field) => (
          <input
            key={field}
            placeholder={field}
            value={newEmp[field]}
            onChange={(e) => setNewEmp((p) => ({ ...p, [field]: e.target.value }))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 flex-1 min-w-[120px]"
          />
        ))}
        <button
          onClick={addEmployee}
          className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600"
        >
          Add
        </button>
      </div>

      <div className="overflow-x-auto text-xs">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-900/80">
            <tr>
              {[
                "employeeId",
                "name",
                "department",
                "role",
                "experienceYears",
                "age",
                "avgHoursPerDay",
                "tasksCompletedPerWeek",
                "overtimeHoursPerWeek",
                "absentDaysPerMonth",
                "productivityScore",
                "actions"
              ].map((h) => (
                <th key={h} className="px-2 py-2 border-b border-slate-800 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-slate-900/60">
                {[
                  "employeeId",
                  "name",
                  "department",
                  "role",
                  "experienceYears",
                  "age",
                  "avgHoursPerDay",
                  "tasksCompletedPerWeek",
                  "overtimeHoursPerWeek",
                  "absentDaysPerMonth"
                ].map((field) => (
                  <td key={field} className="px-2 py-1 border-b border-slate-900">
                    <input
                      value={emp[field] ?? ""}
                      onChange={(e) => handleInlineChange(emp._id, field, e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </td>
                ))}
                <td className="px-2 py-1 border-b border-slate-900 text-center">
                  {emp.productivityScore ?? "—"}
                </td>
                <td className="px-2 py-1 border-b border-slate-900">
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveRow(emp)}
                      disabled={saving}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => deleteRow(emp._id)}
                      className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => predictOne(emp._id)}
                      className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600"
                    >
                      Predict
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center text-slate-500 py-4">
                  No employees yet. Upload a CSV or add manually.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default EmployeeTable;
