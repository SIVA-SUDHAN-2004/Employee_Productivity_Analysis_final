import React, { useEffect, useState } from "react";
import { getSummaryApi, getDepartmentAnalyticsApi } from "../api/analyticsApi.js";
import Card from "../components/Common/Card.jsx";
import DepartmentPieChart from "../components/Charts/DepartmentPieChart.jsx";
import StatTile from "../components/Common/StatTile.jsx";

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [dept, setDept] = useState([]);

  useEffect(() => {
    (async () => {
      const [s, d] = await Promise.all([getSummaryApi(), getDepartmentAnalyticsApi()]);
      setSummary(s.data);
      setDept(d.data);
    })();
  }, []);

  const deptData = dept.map((d) => ({
    department: d._id || "Unknown",
    avgProductivity: d.avgProductivity
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile label="Avg Productivity" value={Math.round(summary?.avgProductivity ?? 0)} />
        <StatTile label="Top Performer" value={summary?.topEmployees?.[0]?.name ?? "—"} />
        <StatTile label="Lowest Performer" value={summary?.bottomEmployees?.[0]?.name ?? "—"} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm font-medium mb-2">Productivity by Department</div>
          <DepartmentPieChart data={deptData} />
        </Card>
        <Card>
          <div className="text-sm font-medium mb-2">Top 5 Employees</div>
          <ul className="text-xs space-y-1">
            {summary?.topEmployees?.map((e) => (
              <li key={e._id} className="flex justify-between">
                <span>{e.name || e.employeeId}</span>
                <span className="text-slate-400">{e.productivityScore}</span>
              </li>
            )) || <li>No data</li>}
          </ul>
          <div className="text-sm font-medium mt-4 mb-2">Bottom 5 Employees</div>
          <ul className="text-xs space-y-1">
            {summary?.bottomEmployees?.map((e) => (
              <li key={e._id} className="flex justify-between">
                <span>{e.name || e.employeeId}</span>
                <span className="text-slate-400">{e.productivityScore}</span>
              </li>
            )) || <li>No data</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
