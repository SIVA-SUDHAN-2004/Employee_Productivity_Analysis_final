import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from "recharts";

const DeptAvgProductivityBar = ({ employees }) => {
  const data = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const dept = e.department || "Unknown";
      const s = e.productivityScore;
      if (s == null || !isFinite(s) || s <= 0) return;
      if (!map[dept]) map[dept] = { sum: 0, count: 0 };
      map[dept].sum += s;
      map[dept].count++;
    });
    return Object.entries(map)
      .map(([dept, { sum, count }]) => ({
        dept,
        avg: Number((sum / count).toFixed(2)),
      }))
      .sort((a, b) => b.avg - a.avg);
  }, [employees]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].payload.dept}</p>
          <p style={{ margin: 0, color: "#818cf8" }}>Avg Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 42)}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
        <XAxis type="number" domain={[1, 5]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <YAxis type="category" dataKey="dept" width={90} tick={{ fontSize: 11, fill: "#e2e8f0" }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="avg" fill="#6366f1" radius={[0, 6, 6, 0]}>
          <LabelList dataKey="avg" position="right" style={{ fontSize: 10, fill: "#a5b4fc" }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DeptAvgProductivityBar;
