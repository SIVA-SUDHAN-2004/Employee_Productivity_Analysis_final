import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSummary, getDepartmentAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.use(protect);

router.get("/summary", getSummary);
router.get("/department", getDepartmentAnalytics);

export default router;
