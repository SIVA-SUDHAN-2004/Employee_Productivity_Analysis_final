import React, { useState } from "react";
import CSVUpload from "../components/Upload/CSVUpload.jsx";
import EmployeeTable from "../components/Employees/EmployeeTable.jsx";

const UploadPage = () => {
  const [employees, setEmployees] = useState([]);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Upload CSV</h1>
      <CSVUpload onUploaded={setEmployees} />
      <EmployeeTable employees={employees} setEmployees={setEmployees} />
    </div>
  );
};

export default UploadPage;
