// server/controllers/employeeController.js
import { parse } from "csv-parse/sync";
import xlsx from "xlsx";
import Employee from "../models/Employee.js";
import {
  predictProductivityRemote,
  predictProductivityBatchRemote
} from "../ml/productivityModel.js";

// POST /api/employees/upload-csv
export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const originalName = req.file.originalname.toLowerCase();
    const buffer = req.file.buffer;

    let records = [];

    // Support both Excel and CSV
    if (originalName.endsWith(".xlsx") || originalName.endsWith(".xls")) {
      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      records = xlsx.utils.sheet_to_json(sheet); // [{...row}, ...]
    } else if (originalName.endsWith(".csv")) {
      const csvString = buffer.toString("utf-8");
      records = parse(csvString, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } else {
      return res.status(400).json({
        message: "Unsupported file type. Please upload .csv or .xlsx"
      });
    }

    const managerId = req.user._id;

    const employeesToInsert = records.map((row, index) => {
      const employeeId =
        row.employeeId ||
        row.EmployeeId ||
        row["employee_id"] ||
        row["Employee_ID"] ||
        row["Employee ID"] ||
        row.id ||
        `EMP_${Date.now()}_${index}`;

      return {
        managerId,
        employeeId,
        name: row.name || row.Name,
        department: row.department || row.Department,
        role: row.role || row.Role,
        experienceYears: Number(
          row.experienceYears ||
            row.ExperienceYears ||
            row["Experience Years"] ||
            0
        ),
        age: Number(row.age || row.Age || 0),
        avgHoursPerDay: Number(
          row.avgHoursPerDay ||
            row.AvgHoursPerDay ||
            row["Avg Hours Per Day"] ||
            0
        ),
        tasksCompletedPerWeek: Number(
          row.tasksCompletedPerWeek ||
            row.TasksCompletedPerWeek ||
            row["Tasks Completed Per Week"] ||
            0
        ),
        overtimeHoursPerWeek: Number(
          row.overtimeHoursPerWeek ||
            row.OvertimeHoursPerWeek ||
            row["Overtime Hours Per Week"] ||
            0
        ),
        absentDaysPerMonth: Number(
          row.absentDaysPerMonth ||
            row.AbsentDaysPerMonth ||
            row["Absent Days Per Month"] ||
            0
        )
      };
    });

    const inserted = await Employee.insertMany(employeesToInsert);

    return res.status(201).json({
      insertedCount: inserted.length,
      sample: inserted.slice(0, 5)
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error while saving employees",
        details: err.message
      });
    }
    return res.status(500).json({
      message: "Error parsing or saving file",
      details: err.message
    });
  }
};

// GET /api/employees?page=1&limit=50
export const getEmployees = async (req, res) => {
  const managerId = req.user._id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const [employees, total] = await Promise.all([
    Employee.find({ managerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Employee.countDocuments({ managerId })
  ]);

  res.json({
    data: employees,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  });
};

// POST /api/employees
export const createEmployee = async (req, res) => {
  const managerId = req.user._id;
  const data = { ...req.body, managerId };
  const emp = await Employee.create(data);
  res.status(201).json(emp);
};

// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const emp = await Employee.findOneAndUpdate(
    { _id: id, managerId: req.user._id },
    req.body,
    { new: true }
  );
  if (!emp) {
    return res.status(404).json({ message: "Employee not found" });
  }
  res.json(emp);
};

// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  const emp = await Employee.findOneAndDelete({
    _id: id,
    managerId: req.user._id
  });
  if (!emp) {
    return res.status(404).json({ message: "Employee not found" });
  }
  res.json({ message: "Deleted" });
};

// POST /api/employees/:id/predict
export const predictForEmployee = async (req, res) => {
  const { id } = req.params;
  const emp = await Employee.findOne({
    _id: id,
    managerId: req.user._id
  });
  if (!emp) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const score = await predictProductivityRemote(emp);
  emp.productivityScore = score;
  await emp.save();

  res.json(emp);
};

// POST /api/employees/predict
export const predictForMany = async (req, res) => {
  const { employeeIds } = req.body;

  let query = { managerId: req.user._id };
  if (Array.isArray(employeeIds) && employeeIds.length) {
    query._id = { $in: employeeIds };
  }

  const employees = await Employee.find(query);

  if (employees.length === 0) {
    return res.json([]);
  }

  const scores = await predictProductivityBatchRemote(employees);

  const updated = await Promise.all(
    employees.map(async (emp, idx) => {
      emp.productivityScore = scores[idx];
      await emp.save();
      return emp;
    })
  );

  res.json(updated);
};
