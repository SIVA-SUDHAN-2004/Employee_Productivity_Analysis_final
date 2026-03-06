import Employee from "../models/Employee.js";

export const getSummary = async (req, res) => {
  const managerId = req.user._id;

  const [agg] = await Employee.aggregate([
    { $match: { managerId } },
    {
      $group: {
        _id: null,
        avgProductivity: { $avg: "$productivityScore" },
        maxProductivity: { $max: "$productivityScore" },
        minProductivity: { $min: "$productivityScore" }
      }
    }
  ]);

  const topEmployees = await Employee.find({ managerId })
    .sort({ productivityScore: -1 })
    .limit(5);

  const bottomEmployees = await Employee.find({ managerId })
    .sort({ productivityScore: 1 })
    .limit(5);

  const departmentAgg = await Employee.aggregate([
    { $match: { managerId } },
    {
      $group: {
        _id: "$department",
        avgProductivity: { $avg: "$productivityScore" },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    avgProductivity: agg?.avgProductivity ?? null,
    maxProductivity: agg?.maxProductivity ?? null,
    minProductivity: agg?.minProductivity ?? null,
    topEmployees,
    bottomEmployees,
    countByDepartment: departmentAgg
  });
};

export const getDepartmentAnalytics = async (req, res) => {
  const managerId = req.user._id;

  const departmentAgg = await Employee.aggregate([
    { $match: { managerId } },
    {
      $group: {
        _id: "$department",
        avgProductivity: { $avg: "$productivityScore" },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(departmentAgg);
};
