import React, { useState } from "react";
import { useEmployee } from "../../context/EmployeeContext.jsx";
import Card from "../Common/Card.jsx";

const emptyEmployee = {
  employeeId: "",
  department: "",
  gender: "",
  age: "",
  jobTitle: "",
  hireDate: "",
  yearsAtCompany: "",
  educationLevel: "",
  performanceScore: "",
  monthlySalary: "",
  workHoursPerWeek: "",
  projectsHandled: "",
  overtimeHours: "",
  sickDays: "",
  remoteWorkFrequency: "",
  teamSize: "",
  trainingHours: "",
  promotions: "",
  employeeSatisfactionScore: "",
  resigned: ""
};

const EDITABLE_FIELDS = [
  "employeeId",
  "department",
  "gender",
  "age",
  "jobTitle",
  "hireDate",
  "yearsAtCompany",
  "educationLevel",
  "performanceScore",
  "monthlySalary",
  "workHoursPerWeek",
  "projectsHandled",
  "overtimeHours",
  "sickDays",
  "remoteWorkFrequency",
  "teamSize",
  "trainingHours",
  "promotions",
  "employeeSatisfactionScore",
  "resigned"
];

const ALL_HEADERS = [...EDITABLE_FIELDS, "productivityScore", "actions"];

/**
 * Renders a productivity score cell.
 * Only shows a value when the server has returned an explicit, non-null,
 * non-zero finite number — i.e. only after Predict has been called.
 * Everything else (null, undefined, 0, NaN, strings) renders as "—".
 */
const ScoreCell = ({ score }) => {
  const hasScore =
    score !== null &&
    score !== undefined &&
    typeof score === "number" &&
    !Number.isNaN(score) &&
    isFinite(score) &&
    score > 0;

  return (
    <td className="px-2 py-1 border-b border-slate-900 text-center">
      {hasScore ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-900/50 text-emerald-300 border border-emerald-700/40">
          {score.toFixed(1)}
        </span>
      ) : (
        <span className="text-slate-600 text-xs">—</span>
      )}
    </td>
  );
};

const PAGE_SIZE = 1000;

const EmployeeTable = () => {
  const {
    employees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    predictOne,
    predictAll
  } = useEmployee();

  const [newEmp, setNewEmp] = useState(emptyEmployee);
  const [drafts, setDrafts] = useState({});
  // How many rows to render — starts at PAGE_SIZE, grows on "Load More"
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");

  const rows = Array.isArray(employees)
    ? employees.filter((e) => {
        if (!searchTerm) return true;
        return String(e.employeeId).toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];
  // The slice that is actually rendered in the DOM
  const visibleRows = rows.slice(0, visibleCount);
  const hasMore = visibleCount < rows.length;

  // Reset visible window when a new upload replaces the dataset
  const prevLengthRef = React.useRef(rows.length);
  React.useEffect(() => {
    if (rows.length !== prevLengthRef.current) {
      setVisibleCount(PAGE_SIZE);
      prevLengthRef.current = rows.length;
    }
  }, [rows.length]);

  // ── Inline field edits ──────────────────────────────────────────────────────
  const handleInlineChange = (id, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value }
    }));
  };

  const getDraftValue = (emp, field) =>
    drafts[emp._id]?.[field] !== undefined ? drafts[emp._id][field] : emp[field] ?? "";

  // ── Save / Delete / Predict ─────────────────────────────────────────────────
  const saveRow = async (emp) => {
    const merged = { ...emp, ...(drafts[emp._id] || {}) };
    const payload = {
      ...merged,
      age: Number(merged.age),
      yearsAtCompany: Number(merged.yearsAtCompany),
      performanceScore: Number(merged.performanceScore),
      monthlySalary: Number(merged.monthlySalary),
      workHoursPerWeek: Number(merged.workHoursPerWeek),
      projectsHandled: Number(merged.projectsHandled),
      overtimeHours: Number(merged.overtimeHours),
      sickDays: Number(merged.sickDays),
      remoteWorkFrequency: Number(merged.remoteWorkFrequency),
      teamSize: Number(merged.teamSize),
      trainingHours: Number(merged.trainingHours),
      promotions: Number(merged.promotions),
      employeeSatisfactionScore: Number(merged.employeeSatisfactionScore),
      resigned: Number(merged.resigned)
    };
    await updateEmployee(emp._id, payload);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[emp._id];
      return next;
    });
  };

  const deleteRow = async (id) => {
    await deleteEmployee(id);
  };

  const handlePredictOne = async (id) => {
    await predictOne(id);
  };

  const handlePredictAll = async () => {
    const ids = rows.map((e) => e._id);
    await predictAll(ids);
  };

  // ── Add new employee ────────────────────────────────────────────────────────
  const addEmployee = async () => {
    const payload = {
      ...newEmp,
      age: Number(newEmp.age),
      yearsAtCompany: Number(newEmp.yearsAtCompany),
      performanceScore: Number(newEmp.performanceScore),
      monthlySalary: Number(newEmp.monthlySalary),
      workHoursPerWeek: Number(newEmp.workHoursPerWeek),
      projectsHandled: Number(newEmp.projectsHandled),
      overtimeHours: Number(newEmp.overtimeHours),
      sickDays: Number(newEmp.sickDays),
      remoteWorkFrequency: Number(newEmp.remoteWorkFrequency),
      teamSize: Number(newEmp.teamSize),
      trainingHours: Number(newEmp.trainingHours),
      promotions: Number(newEmp.promotions),
      employeeSatisfactionScore: Number(newEmp.employeeSatisfactionScore),
      resigned: Number(newEmp.resigned)
    };
    await createEmployee(payload);
    setNewEmp(emptyEmployee);
  };

  return (
    <Card className="mt-4">
      {/* Header row */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-slate-200">
          Employees ({rows.length.toLocaleString()}
          {hasMore && (
            <span className="text-slate-500 font-normal">
              {" "}— showing {visibleCount.toLocaleString()}
            </span>
          )}
          )
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search Employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-full text-slate-200 outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
          />
          {rows.length > 0 && (
            <button
              onClick={handlePredictAll}
              className="text-xs px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors font-medium"
            >
              ⚡ Predict Productivity for All
            </button>
          )}
        </div>
      </div>

      {/* New employee input row */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        {Object.keys(emptyEmployee).map((field) => (
          <input
            key={field}
            placeholder={field}
            value={newEmp[field]}
            onChange={(e) => setNewEmp((p) => ({ ...p, [field]: e.target.value }))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 flex-1 min-w-[120px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        ))}
        <button
          onClick={addEmployee}
          className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors font-medium"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-xs">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-900/80">
            <tr>
              {ALL_HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-2 py-2 border-b border-slate-800 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {h === "productivityScore" ? "Score" : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((emp, index) => (
              <tr
                key={emp._id || emp.employeeId || index}
                className="hover:bg-slate-900/60 transition-colors"
              >
                {EDITABLE_FIELDS.map((field) => (
                  <td key={field} className="px-2 py-1 border-b border-slate-900">
                    <input
                      value={getDraftValue(emp, field)}
                      onChange={(e) =>
                        handleInlineChange(emp._id, field, e.target.value)
                      }
                      className="w-full bg-transparent outline-none focus:text-indigo-300"
                    />
                  </td>
                ))}

                {/* Score column — only shows if a real score exists */}
                <ScoreCell score={emp.productivityScore} />

                {/* Actions column */}
                <td className="px-2 py-1 border-b border-slate-900">
                  <div className="flex gap-1 whitespace-nowrap">
                    <button
                      onClick={() => saveRow(emp)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => deleteRow(emp._id)}
                      className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handlePredictOne(emp._id)}
                      className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 transition-colors"
                    >
                      Predict
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={ALL_HEADERS.length}
                  className="text-center text-slate-500 py-8"
                >
                  No employees yet. Upload a CSV or add one manually.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Load More footer */}
      {rows.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
          <span>
            Showing{" "}
            <span className="text-slate-300 font-medium">
              {Math.min(visibleCount, rows.length).toLocaleString()}
            </span>
            {" "}of{" "}
            <span className="text-slate-300 font-medium">
              {rows.length.toLocaleString()}
            </span>
            {" "}employees
          </span>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="px-4 py-1.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 transition-all font-medium"
            >
              Load {Math.min(PAGE_SIZE, rows.length - visibleCount).toLocaleString()} more ↓
            </button>
          )}
          {!hasMore && rows.length > PAGE_SIZE && (
            <span className="text-emerald-500/70 text-[11px]">✓ All records loaded</span>
          )}
        </div>
      )}
    </Card>
  );
};

export default EmployeeTable;
