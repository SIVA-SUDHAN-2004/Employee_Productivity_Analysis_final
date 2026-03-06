import React, { useEffect, useState } from "react";
import { getEmployeesApi } from "../api/employeeApi.js";
import EmployeeTable from "../components/Employees/EmployeeTable.jsx";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadEmployees = async (pageNum = 1) => {
    const res = await getEmployeesApi(pageNum, 50);
    const list = Array.isArray(res.data) ? res.data : res.data.data || [];
    setEmployees(list);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    loadEmployees(1);
  }, []);

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Employees</h1>
      <EmployeeTable employees={employees} setEmployees={setEmployees} />
      {/* pagination UI */}
    </div>
  );
};

export default EmployeesPage;
