import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: String,
    department: String,
    gender: String,
    age: Number,
    jobTitle: String,
    hireDate: String,
    yearsAtCompany: Number,
    educationLevel: String,
    performanceScore: Number,
    monthlySalary: Number,
    workHoursPerWeek: Number,
    projectsHandled: Number,
    overtimeHours: Number,
    sickDays: Number,
    remoteWorkFrequency: Number,
    teamSize: Number,
    trainingHours: Number,
    promotions: Number,
    employeeSatisfactionScore: Number,
    resigned: Number,
    productivityScore: { type: Number, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
