import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from "recharts";

const JOBTITLE_COLORS = [
  "#6366f1", "#22d3ee", "#f59e0b", "#ec4899",
  "#10b981", "#f97316", "#8b5cf6", "#14b8a6"
];

const RoleProductivityBar = ({ employees }) => {
  const data = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const jobTitle = e.jobTitle || "Unknown";
      const s = e.productivityScore;
      if (s == null || !isFinite(s) || s <= 0) return;
      if (!map[jobTitle]) map[jobTitle] = { sum: 0, count: 0 };
      map[jobTitle].sum += s;
      map[jobTitle].count++;
    });
    return Object.entries(map)
      .map(([jobTitle, { sum, count }]) => ({
        jobTitle,
        avg: Math.round(sum / count),
        headcount: count,
      }))
      .sort((a, b) => b.avg - a.avg);
  }, [employees]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>{d.jobTitle}</p>
          <p style={{ margin: 0, color: "#a5b4fc" }}>Avg Score: {d.avg}</p>
          <p style={{ margin: 0, color: "#94a3b8" }}>Employees: {d.headcount}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
        <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <YAxis type="category" dataKey="jobTitle" width={100} tick={{ fontSize: 11, fill: "#e2e8f0" }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="avg" radius={[0, 6, 6, 0]}>
          {data.map((entry, i) => (
            <Cell key={entry.jobTitle} fill={JOBTITLE_COLORS[i % JOBTITLE_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RoleProductivityBar;
