import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const HoursVsProductivityScatter = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <ScatterChart>
      <CartesianGrid stroke="#1f2937" />
      <XAxis
        type="number"
        dataKey="avgHoursPerDay"
        name="Hours/day"
        tick={{ fontSize: 10, fill: "#9ca3af" }}
      />
      <YAxis
        type="number"
        dataKey="productivityScore"
        name="Productivity"
        tick={{ fontSize: 10, fill: "#9ca3af" }}
      />
      <Tooltip
        cursor={{ strokeDasharray: "3 3" }}
        contentStyle={{ background: "#020617", border: "1px solid #1f2937", fontSize: 12 }}
      />
      <Scatter data={data} />
    </ScatterChart>
  </ResponsiveContainer>
);

export default HoursVsProductivityScatter;
