// server/ml/productivityModel.js
import axios from "axios";

/**
 * Map MongoDB Employee document to Python Employee schema.
 * Adjust these mappings to match your actual Mongo fields.
 */
function mapEmployeeToPythonSchema(emp) {
  return {
    Department: emp.department || "General",
    Gender: emp.gender || "Unknown",
    Age: emp.age ?? 0,
    Job_Title: emp.jobTitle || "",
    Years_At_Company: emp.yearsAtCompany ?? 0,
    Education_Level: emp.educationLevel || "Bachelors",
    Monthly_Salary: emp.monthlySalary ?? 0,
    Work_Hours_Per_Week: emp.workHoursPerWeek ?? 0,
    Projects_Handled: emp.projectsHandled ?? 0,
    Overtime_Hours: emp.overtimeHours ?? 0,
    Sick_Days: emp.sickDays ?? 0,
    Remote_Work_Frequency: emp.remoteWorkFrequency ?? 0,
    Team_Size: emp.teamSize ?? 0,
    Training_Hours: emp.trainingHours ?? 0,
    Promotions: emp.promotions ?? 0,
    Employee_Satisfaction_Score: emp.employeeSatisfactionScore ?? 0,
    Resigned: emp.resigned ?? 0
  };
}

/**
 * Call the Python FastAPI service for a single employee.
 */
export async function predictProductivityRemote(emp) {
  const pyEmployee = mapEmployeeToPythonSchema(emp);

  const response = await axios.post(`${process.env.ML_API_URL}/predict`, {
    employee: pyEmployee
  });

  return response.data.Predicted_Performance_Score;
}

/**
 * Call the Python FastAPI service for multiple employees (batch).
 */
export async function predictProductivityBatchRemote(employees) {
  const pyEmployees = employees.map(mapEmployeeToPythonSchema);

  const response = await axios.post(`${process.env.ML_API_URL}/predict-batch`, {
    employees: pyEmployees
  });

  // response.data.scores is an array aligned with employees
  return response.data.scores;
}
