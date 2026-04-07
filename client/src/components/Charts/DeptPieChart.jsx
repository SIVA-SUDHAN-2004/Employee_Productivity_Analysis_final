import React, { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899", "#eab308", "#0ea5e9", "#8b5cf6", "#14b8a6"];

const DeptPieChart = ({ employees }) => {
  const data = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const dept = e.department || "Unknown";
      map[dept] = (map[dept] || 0) + 1;
    });
    return Object.entries(map).map(([department, count]) => ({ department, count }));
  }, [employees]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const total = data.reduce((a, d) => a + d.count, 0);
      const pct = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: "#a5b4fc" }}>{payload[0].value} employees ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="department"
          cx="50%"
          cy="50%"
          outerRadius={95}
          labelLine={false}
          label={renderLabel}
        >
          {data.map((entry, index) => (
            <Cell key={entry.department} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DeptPieChart;
