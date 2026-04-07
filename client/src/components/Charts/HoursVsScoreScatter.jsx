import React, { useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ZAxis
} from "recharts";

const HoursVsScoreScatter = ({ employees }) => {
  const data = useMemo(() =>
    employees
      .filter((e) => e.productivityScore > 0 && isFinite(e.productivityScore))
      .map((e) => ({
        hours: Number(e.workHoursPerWeek) || 0,
        score: Number(e.productivityScore) || 0,
        name: e.name || e.employeeId,
      })),
    [employees]
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0]?.payload;
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>{d?.name}</p>
          <p style={{ margin: 0, color: "#34d399" }}>Hours/day: {d?.hours}</p>
          <p style={{ margin: 0, color: "#818cf8" }}>Score: {d?.score?.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ScatterChart>
        <CartesianGrid stroke="#1e293b" />
        <XAxis type="number" dataKey="hours" name="Hours/day" tick={{ fontSize: 10, fill: "#94a3b8" }} label={{ value: "Avg Hours/Day", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }} />
        <YAxis type="number" dataKey="score" name="Score" domain={[1, 5]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <ZAxis range={[30, 30]} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "#475569" }} />
        <Scatter data={data} fill="#6366f1" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default HoursVsScoreScatter;
