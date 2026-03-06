import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899", "#eab308", "#0ea5e9"];

const DepartmentPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <PieChart>
      <Pie
        data={data}
        dataKey="avgProductivity"
        nameKey="department"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((entry, index) => (
          <Cell key={entry.department} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{ background: "#020617", border: "1px solid #1f2937", fontSize: 12 }}
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default DepartmentPieChart;
