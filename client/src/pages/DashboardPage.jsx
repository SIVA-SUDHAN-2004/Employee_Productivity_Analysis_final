// client/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { getSummaryApi } from "../api/analyticsApi.js";
import { useEmployee } from "../context/EmployeeContext.jsx";
import StatTile from "../components/Common/StatTile.jsx";
import Card from "../components/Common/Card.jsx";
import ProductivityBarChart from "../components/Charts/ProductivityBarChart.jsx";
import HoursVsProductivityScatter from "../components/Charts/HoursVsProductivityScatter.jsx";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  // Use context so data persists across navigation and stays in sync
  const { employees } = useEmployee();

  useEffect(() => {
    (async () => {
      try {
        const sRes = await getSummaryApi();
        setSummary(sRes.data);
      } catch (err) {
        console.error("Dashboard summary load error:", err);
      }
    })();
  }, []);

  // Only include employees that have been predicted for charts
  const predictedEmployees = employees.filter(
    (e) => e.productivityScore !== null && e.productivityScore !== undefined && e.productivityScore !== 0
  );

  const barData = predictedEmployees.map((e) => ({
    name: e.name || e.employeeId,
    productivityScore: e.productivityScore ?? 0
  }));

  const scatterData = predictedEmployees.map((e) => ({
    avgHoursPerDay: e.avgHoursPerDay ?? 0,
    productivityScore: e.productivityScore ?? 0
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatTile
          label="Avg Productivity"
          value={Math.round(summary?.avgProductivity ?? 0)}
        />
        <StatTile label="Max Productivity" value={summary?.maxProductivity ?? "—"} />
        <StatTile label="Min Productivity" value={summary?.minProductivity ?? "—"} />
        <StatTile label="Employees Tracked" value={employees.length} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm font-medium mb-2">Productivity by Employee</div>
          {barData.length > 0 ? (
            <ProductivityBarChart data={barData} />
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              No productivity scores yet. Use Predict to generate scores.
            </p>
          )}
        </Card>
        <Card>
          <div className="text-sm font-medium mb-2">Hours vs Productivity</div>
          {scatterData.length > 0 ? (
            <HoursVsProductivityScatter data={scatterData} />
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              No productivity scores yet. Use Predict to generate scores.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
