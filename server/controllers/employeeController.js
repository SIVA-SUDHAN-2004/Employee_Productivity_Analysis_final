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
  console.log("uploadCSV: start");
  try {
    if (!req.file) {
      console.log("uploadCSV: no file");
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

    // Extract top 1500 records safely. 100k insertion overloads free-tier clusters
    // and causes the connection to time out or freeze the browser table.
    // const maxRecords = records.slice(0, 1500);

    const employeesToInsert = records.map((row, index) => {
      const rowClean = {};
      for (const k in row) {
        if (row.hasOwnProperty(k)) {
          rowClean[k.toLowerCase().replace(/[\s_]/g, "")] = row[k];
        }
      }

      const employeeId =
        rowClean.employeeid ||
        rowClean.id ||
        `ROW_${index + 1}`;

      return {
        managerId,
        employeeId,
        department: rowClean.department || rowClean.dept || "",
        gender: rowClean.gender || "",
        age: Number(rowClean.age || 0),
        jobTitle: rowClean.jobtitle || rowClean.role || "",
        hireDate: rowClean.hiredate || "",
        yearsAtCompany: Number(rowClean.yearsatcompany || rowClean.experience || 0),
        educationLevel: rowClean.educationlevel || "",
        performanceScore: Number(rowClean.performancescore || rowClean.performance || 0),
        monthlySalary: Number(rowClean.monthlysalary || rowClean.salary || 0),
        workHoursPerWeek: Number(rowClean.workhoursperweek || rowClean.workhours || 0),
        projectsHandled: Number(rowClean.projectshandled || rowClean.projects || 0),
        overtimeHours: Number(rowClean.overtimehours || rowClean.overtime || 0),
        sickDays: Number(rowClean.sickdays || rowClean.absences || 0),
        remoteWorkFrequency: Number(rowClean.remoteworkfrequency || rowClean.remotework || 0),
        teamSize: Number(rowClean.teamsize || 0),
        trainingHours: Number(rowClean.traininghours || 0),
        promotions: Number(rowClean.promotions || 0),
        employeeSatisfactionScore: Number(rowClean.employeesatisfactionscore || rowClean.satisfaction || 0),
        resigned: 
          String(rowClean.resigned).toLowerCase() === "true" || String(rowClean.resigned) === "1"
            ? 1 
            : 0
      };
    });

    // ── Full replace: wipe the manager's existing dataset, then insert fresh ──
    // This prevents stale records from previous uploads accumulating in MongoDB.
    // Every upload is treated as the authoritative, current dataset.
    await Employee.deleteMany({ managerId });
    const inserted = await Employee.insertMany(
      employeesToInsert.map((emp) => ({ ...emp, productivityScore: null })),
      { ordered: false }
    );

    // Fetch only the most recent subset to prevent huge JSON strings crashing Node
    const allRecords = await Employee.find({ managerId })
      .sort({ createdAt: 1 })
      // .limit(1500)
      // .lean();

    return res.status(201).json({
      insertedCount: inserted.length,
      employees: allRecords
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
  const limit = Number(req.query.limit) || 10000;
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

// DELETE /api/employees  — wipe all records for the authenticated manager
export const deleteAllEmployees = async (req, res) => {
  try {
    const result = await Employee.deleteMany({ managerId: req.user._id });
    return res.json({
      message: "All employee data cleared",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to clear employee data", details: err.message });
  }
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
  try {
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
  } catch (err) {
    console.error("ML Prediction Error:", err.message);
    res.status(500).json({ message: "Failed to predict productivity", details: err.message });
  }
};
