import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell, ReferenceLine
} from "recharts";

const TopBottomEmployeesChart = ({ employees }) => {
  const { top, bottom } = useMemo(() => {
    const scored = employees
      .filter((e) => e.productivityScore > 0 && isFinite(e.productivityScore))
      .map((e) => ({
        name: e.name || e.employeeId || "Unknown",
        score: Number(e.productivityScore.toFixed(2)),
        dept: e.department || "",
        role: e.jobTitle || "",
      }))
      .sort((a, b) => b.score - a.score);

    return {
      top: scored.slice(0, 5),
      bottom: scored.slice(-5).reverse(),
    };
  }, [employees]);

  const all = [
    ...top.map((e) => ({ ...e, type: "top" })),
    ...bottom.map((e) => ({ ...e, type: "bottom" })),
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>{d.name}</p>
          <p style={{ margin: 0, color: d.type === "top" ? "#34d399" : "#f87171" }}>Score: {d.score}</p>
          {d.dept && <p style={{ margin: 0, color: "#94a3b8" }}>{d.dept} • {d.role}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={all} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[1, 5]} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
          {all.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.type === "top" ? "#22c55e" : "#ef4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopBottomEmployeesChart;
