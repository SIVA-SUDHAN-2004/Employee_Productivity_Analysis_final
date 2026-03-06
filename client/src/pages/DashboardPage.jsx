// client/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { getSummaryApi } from "../api/analyticsApi.js";
import { getEmployeesApi } from "../api/employeeApi.js";
import StatTile from "../components/Common/StatTile.jsx";
import Card from "../components/Common/Card.jsx";
import ProductivityBarChart from "../components/Charts/ProductivityBarChart.jsx";
import HoursVsProductivityScatter from "../components/Charts/HoursVsProductivityScatter.jsx";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    (async () => {
      const [sRes, eRes] = await Promise.all([
        getSummaryApi(),
        getEmployeesApi(1, 50) // page 1, limit 50
      ]);

      setSummary(sRes.data);

      // eRes.data is the paging object { data, total, page, totalPages }
      const list = Array.isArray(eRes.data)
        ? eRes.data
        : eRes.data?.data || [];

      setEmployees(list);
    })();
  }, []);

  const barData = employees.map((e) => ({
    name: e.name || e.employeeId,
    productivityScore: e.productivityScore ?? 0
  }));

  const scatterData = employees.map((e) => ({
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
        <StatTile label="Employees Tracked" value={summary?.topEmployees?.length ?? 0} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm font-medium mb-2">Productivity by Employee</div>
          <ProductivityBarChart data={barData} />
        </Card>
        <Card>
          <div className="text-sm font-medium mb-2">Hours vs Productivity</div>
          <HoursVsProductivityScatter data={scatterData} />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
