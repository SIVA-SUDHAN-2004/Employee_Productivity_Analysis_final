import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

const TasksOvertimeByRole = ({ employees }) => {
  const data = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const jobTitle = e.jobTitle || "Unknown";
      if (!map[jobTitle]) map[jobTitle] = { sumTasks: 0, sumOvertime: 0, count: 0 };
      map[jobTitle].sumTasks += Number(e.projectsHandled) || 0;
      map[jobTitle].sumOvertime += Number(e.overtimeHours) || 0;
      map[jobTitle].count++;
    });
    return Object.entries(map)
      .map(([jobTitle, v]) => ({
        jobTitle,
        avgTasks: Number((v.sumTasks / v.count).toFixed(1)),
        avgOvertime: Number((v.sumOvertime / v.count).toFixed(1)),
      }))
      .sort((a, b) => b.avgTasks - a.avgTasks)
      .slice(0, 10);
  }, [employees]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="tooltip-box">
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          {payload.map((p) => (
            <p key={p.name} style={{ margin: 0, color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="jobTitle" tick={{ fontSize: 9, fill: "#94a3b8" }} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="avgTasks" name="Tasks/Week" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="avgOvertime" name="Overtime Hrs" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TasksOvertimeByRole;
