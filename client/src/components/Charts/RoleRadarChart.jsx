import React, { useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from "recharts";

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#ec4899", "#10b981", "#f97316"];

const RoleRadarChart = ({ employees }) => {
  // Get top 6 roles by count
  const { roles, data } = useMemo(() => {
    const roleMap = {};
    employees.forEach((e) => {
      const jobTitle = e.jobTitle || "Unknown";
      const s = e.productivityScore;
      if (s == null || !isFinite(s) || s <= 0) return;
      if (!roleMap[jobTitle]) roleMap[jobTitle] = { sum: 0, count: 0, sumHours: 0, sumTasks: 0, sumOvertime: 0, sumAbsent: 0 };
      roleMap[jobTitle].sum += s;
      roleMap[jobTitle].count++;
      roleMap[jobTitle].sumHours += Number(e.workHoursPerWeek) || 0;
      roleMap[jobTitle].sumTasks += Number(e.projectsHandled) || 0;
      roleMap[jobTitle].sumOvertime += Number(e.overtimeHours) || 0;
      roleMap[jobTitle].sumAbsent += Number(e.sickDays) || 0;
    });

    const sorted = Object.entries(roleMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6);

    const roles = sorted.map(([r]) => r);

    // Build radar data: each metric is one spoke, and each jobTitle is a series
    const metrics = ["Productivity", "Hours/Day", "Tasks/Wk", "Overtime", "Absences"];
    const data = metrics.map((metric) => {
      const point = { subject: metric };
      sorted.forEach(([jobTitle, v]) => {
        if (metric === "Productivity") point[jobTitle] = Math.round(v.sum / v.count);
        else if (metric === "Hours/Day") point[jobTitle] = Math.round((v.sumHours / v.count) * 10);
        else if (metric === "Tasks/Wk") point[jobTitle] = Math.round(v.sumTasks / v.count);
        else if (metric === "Overtime") point[jobTitle] = Math.round(v.sumOvertime / v.count * 10);
        else if (metric === "Absences") point[jobTitle] = Math.round(v.sumAbsent / v.count * 10);
      });
      return point;
    });

    return { roles, data };
  }, [employees]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
        <PolarGrid stroke="#1e293b" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <PolarRadiusAxis tick={{ fontSize: 9, fill: "#475569" }} />
        <Tooltip
          contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {roles.map((jobTitle, i) => (
          <Radar
            key={jobTitle}
            name={jobTitle}
            dataKey={jobTitle}
            stroke={COLORS[i % COLORS.length]}
            fill={COLORS[i % COLORS.length]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RoleRadarChart;
