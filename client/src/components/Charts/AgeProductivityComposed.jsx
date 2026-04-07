import React, { useMemo } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

const AgeProductivityComposed = ({ employees }) => {
  const data = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const ageGroup = Math.floor((Number(e.age) || 20) / 5) * 5;
      const label = `${ageGroup}–${ageGroup + 4}`;
      const s = e.productivityScore;
      if (!map[label]) map[label] = { sum: 0, count: 0, ageNum: ageGroup };
      if (s != null && isFinite(s) && s > 0) {
        map[label].sum += s;
        map[label].count++;
      }
    });
    return Object.entries(map)
      .map(([age, v]) => ({
        age,
        ageNum: v.ageNum,
        headcount: v.count,
        avg: v.count > 0 ? Number((v.sum / v.count).toFixed(2)) : 0,
      }))
      .sort((a, b) => a.ageNum - b.ageNum);
  }, [employees]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>Age {label}</p>
          {payload.map((p) => (
            <p key={p.name} style={{ margin: 0, color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={270}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="age" tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[1, 5]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar yAxisId="left" dataKey="headcount" name="Employees" fill="#6366f1" opacity={0.6} radius={[4, 4, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="avg" name="Avg Score" stroke="#f472b6" strokeWidth={2.5} dot={{ r: 4, fill: "#f472b6", strokeWidth: 0 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default AgeProductivityComposed;
