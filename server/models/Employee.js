import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String },
    name: String,
    department: String,
    role: String,
    experienceYears: Number,
    age: Number,
    avgHoursPerDay: Number,
    tasksCompletedPerWeek: Number,
    overtimeHoursPerWeek: Number,
    absentDaysPerMonth: Number,
    productivityScore: { type: Number, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
