import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const ProductivityBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} />
      <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
      <Tooltip
        contentStyle={{ background: "#8f9cd6ff", border: "1px solid #1f2937", fontSize: 12 }}
      />
      <Bar dataKey="productivityScore" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default ProductivityBarChart;
