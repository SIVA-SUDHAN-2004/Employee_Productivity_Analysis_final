import React, { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

const AbsenceVsProductivityArea = ({ employees }) => {
  const data = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const days = Math.round(Number(e.sickDays) || 0);
      const s = e.productivityScore;
      if (s == null || !isFinite(s) || s <= 0) return;
      if (!map[days]) map[days] = { sum: 0, count: 0 };
      map[days].sum += s;
      map[days].count++;
    });
    return Object.entries(map)
      .map(([days, { sum, count }]) => ({
        days: Number(days),
        avg: Number((sum / count).toFixed(1)),
      }))
      .sort((a, b) => a.days - b.days);
  }, [employees]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>Absent {payload[0].payload.days} days/mo</p>
          <p style={{ margin: 0, color: "#34d399" }}>Avg Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="absGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="days"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          label={{ value: "Absent Days/Month", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }}
        />
        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[1, 5]} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="avg"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#absGrad)"
          dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AbsenceVsProductivityArea;
