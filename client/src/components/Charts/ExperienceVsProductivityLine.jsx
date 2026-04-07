import React, { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine
} from "recharts";

const ExperienceVsProductivityLine = ({ employees }) => {
  const data = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const exp = Math.floor(Number(e.yearsAtCompany) || 0);
      const s = e.productivityScore;
      if (s == null || !isFinite(s) || s <= 0) return;
      if (!map[exp]) map[exp] = { sum: 0, count: 0 };
      map[exp].sum += s;
      map[exp].count++;
    });
    return Object.entries(map)
      .map(([exp, { sum, count }]) => ({
        experience: Number(exp),
        avg: Number((sum / count).toFixed(1)),
      }))
      .sort((a, b) => a.experience - b.experience);
  }, [employees]);

  const overall =
    data.length > 0
      ? data.reduce((acc, d) => acc + d.avg, 0) / data.length
      : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>Exp: {payload[0].payload.experience} yrs</p>
          <p style={{ margin: 0, color: "#f472b6" }}>Avg Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="experience"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          label={{ value: "Years of Experience", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }}
        />
        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[1, 5]} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={overall} stroke="#475569" strokeDasharray="4 4" label={{ value: "Avg", fill: "#64748b", fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="avg"
          stroke="#f472b6"
          strokeWidth={2.5}
          dot={{ fill: "#f472b6", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExperienceVsProductivityLine;
