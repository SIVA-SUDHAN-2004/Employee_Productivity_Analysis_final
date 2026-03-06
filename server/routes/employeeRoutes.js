// server/routes/employeeRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  uploadCSV,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  predictForEmployee,
  predictForMany
} from "../controllers/employeeController.js";

const router = express.Router();

// All routes protected
router.use(protect);

// File upload
router.post("/upload-csv", upload.single("file"), uploadCSV);

// CRUD
router.get("/", getEmployees);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

// ML prediction
router.post("/predict", predictForMany);
router.post("/:id/predict", predictForEmployee);

export default router;
