import React, { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const ProductivityDistributionChart = ({ employees }) => {
  const data = useMemo(() => {
    // Create highly granular distribution buckets between 1.0 and 5.0
    const intervals = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    const bins = intervals.map(val => ({ scoreVal: val.toFixed(1), count: 0 }));

    employees.forEach((e) => {
      const s = e.productivityScore;
      if (s == null || !isFinite(s)) return;
      
      // Map each employee to their closest score bucket to form a density curve
      let closestIdx = 0;
      let minDiff = Infinity;
      intervals.forEach((val, i) => {
        const diff = Math.abs(s - val);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });
      bins[closestIdx].count++;
    });
    
    return bins;
  }, [employees]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="tooltip-box" style={{ background: "rgba(15, 23, 42, 0.95)", border: "1px solid #334155", padding: "10px 14px", borderRadius: 8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)" }}>
          <p style={{ margin: 0, fontWeight: 700, color: "#f8fafc" }}>Score ≈ {payload[0].payload.scoreVal}</p>
          <p style={{ margin: "4px 0 0", color: "#38bdf8", fontSize: 13, fontWeight: 500 }}>{payload[0].value} employees</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis 
          dataKey="scoreVal" 
          tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} 
          tickLine={false}
          axisLine={{ stroke: "#334155" }}
          tickMargin={10}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: "#64748b" }} 
          axisLine={false}
          tickLine={false}
          allowDecimals={false} 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area 
          type="monotone" 
          dataKey="count" 
          stroke="#0ea5e9" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#scoreGradient)" 
          activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#0f172a", strokeWidth: 3 }}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ProductivityDistributionChart;
