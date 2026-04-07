import React from "react";
import EmployeeTable from "../components/Employees/EmployeeTable.jsx";
import { useEmployee } from "../context/EmployeeContext.jsx";

const EmployeesPage = () => {
  const { employees, hasUploaded } = useEmployee();

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Employees</h1>

      {!hasUploaded && employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📂</div>
          <h2 className="text-slate-300 text-base font-semibold mb-2">No Employee Data Available</h2>
          <p className="text-slate-500 text-sm max-w-sm">
            No records found. Please go to{" "}
            <a href="/upload" className="text-indigo-400 hover:underline">
              Upload CSV
            </a>{" "}
            to import your employee data.
          </p>
        </div>
      ) : (
        <EmployeeTable />
      )}
    </div>
  );
};

export default EmployeesPage;
