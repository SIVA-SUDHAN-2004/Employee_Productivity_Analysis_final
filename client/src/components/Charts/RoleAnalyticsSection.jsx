import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from "recharts";

const JOBTITLE_COLORS = [
  "#6366f1", "#22d3ee", "#f59e0b", "#ec4899",
  "#10b981", "#f97316", "#8b5cf6", "#14b8a6", "#e11d48", "#84cc16"
];

const MetricBar = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
        <span style={{ color: "#94a3b8" }}>{label}</span>
        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 4, height: 7, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
};

const RoleAnalyticsSection = ({ employees }) => {
  const roles = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const jobTitle = e.jobTitle || "Unknown";
      if (!map[jobTitle]) {
        map[jobTitle] = {
          jobTitle,
          count: 0,
          sumScore: 0,
          sumHours: 0,
          sumTasks: 0,
          sumOvertime: 0,
          sumAbsent: 0,
          sumExp: 0,
          scoredCount: 0,
        };
      }
      const r = map[jobTitle];
      r.count++;
      r.sumHours += Number(e.workHoursPerWeek) || 0;
      r.sumTasks += Number(e.projectsHandled) || 0;
      r.sumOvertime += Number(e.overtimeHours) || 0;
      r.sumAbsent += Number(e.sickDays) || 0;
      r.sumExp += Number(e.yearsAtCompany) || 0;
      const s = e.productivityScore;
      if (s != null && isFinite(s) && s > 0) {
        r.sumScore += s;
        r.scoredCount++;
      }
    });
    return Object.values(map)
      .map((r) => ({
        ...r,
        avgScore: r.scoredCount > 0 ? r.sumScore / r.scoredCount : 0,
        avgHours: r.count > 0 ? r.sumHours / r.count : 0,
        avgTasks: r.count > 0 ? r.sumTasks / r.count : 0,
        avgOvertime: r.count > 0 ? r.sumOvertime / r.count : 0,
        avgAbsent: r.count > 0 ? r.sumAbsent / r.count : 0,
        avgExp: r.count > 0 ? r.sumExp / r.count : 0,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [employees]);

  const [selectedRole, setSelectedRole] = useState(null);

  const activeRole = useMemo(
    () => roles.find((r) => r.jobTitle === selectedRole) || roles[0],
    [roles, selectedRole]
  );

  const maxScore = Math.max(...roles.map((r) => r.avgScore), 1);
  const maxHours = Math.max(...roles.map((r) => r.avgHours), 1);
  const maxTasks = Math.max(...roles.map((r) => r.avgTasks), 1);
  const maxOvertime = Math.max(...roles.map((r) => r.avgOvertime), 1);
  const maxAbsent = Math.max(...roles.map((r) => r.avgAbsent), 1);

  const radarData = useMemo(() => {
    if (!activeRole) return [];
    return [
      { metric: "Productivity", value: Math.round(activeRole.avgScore) },
      { metric: "Hours/Day", value: Math.round(activeRole.avgHours * 10) },
      { metric: "Tasks/Wk", value: Math.round(activeRole.avgTasks) },
      { metric: "Overtime", value: Math.round(activeRole.avgOvertime * 10) },
      { metric: "Experience", value: Math.round(activeRole.avgExp * 5) },
    ];
  }, [activeRole]);

  if (roles.length === 0) {
    return (
      <div style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: "40px 0" }}>
        No jobTitle data available. Run "Predict All" first to populate analytics.
      </div>
    );
  }

  return (
    <div>
      {/* Role selector tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {roles.map((r, i) => (
          <button
            key={r.jobTitle}
            onClick={() => setSelectedRole(r.jobTitle)}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              border: "1.5px solid",
              cursor: "pointer",
              transition: "all 0.2s",
              background: (selectedRole === r.jobTitle || (!selectedRole && i === 0))
                ? JOBTITLE_COLORS[i % JOBTITLE_COLORS.length]
                : "transparent",
              borderColor: JOBTITLE_COLORS[i % JOBTITLE_COLORS.length],
              color: (selectedRole === r.jobTitle || (!selectedRole && i === 0))
                ? "#fff"
                : JOBTITLE_COLORS[i % JOBTITLE_COLORS.length],
            }}
          >
            {r.jobTitle} <span style={{ opacity: 0.7 }}>({r.count})</span>
          </button>
        ))}
      </div>

      {activeRole && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left: metric bars */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{activeRole.jobTitle}</span>
              <span style={{ marginLeft: 10, fontSize: 12, color: "#64748b" }}>
                {activeRole.count} employees · Avg exp {activeRole.avgExp.toFixed(1)} yrs
              </span>
            </div>
            <MetricBar label="Avg Productivity Score" value={activeRole.avgScore} max={maxScore} color="#6366f1" />
            <MetricBar label="Avg Hours / Day" value={activeRole.avgHours} max={maxHours} color="#22d3ee" />
            <MetricBar label="Avg Tasks / Week" value={activeRole.avgTasks} max={maxTasks} color="#f59e0b" />
            <MetricBar label="Avg Overtime Hrs / Wk" value={activeRole.avgOvertime} max={maxOvertime} color="#ec4899" />
            <MetricBar label="Avg Absent Days / Mo" value={activeRole.avgAbsent} max={maxAbsent} color="#f97316" />
          </div>

          {/* Right: radar */}
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar
                name={activeRole.jobTitle}
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* All-roles productivity overview chart */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 10 }}>
          All Roles — Avg Productivity Score
        </div>
        <ResponsiveContainer width="100%" height={Math.max(180, roles.length * 38)}>
          <BarChart data={roles} layout="vertical" margin={{ left: 10, right: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
            <YAxis type="category" dataKey="jobTitle" width={110} tick={{ fontSize: 11, fill: "#e2e8f0" }} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
              formatter={(v) => [v.toFixed(1), "Avg Score"]}
            />
            <Bar dataKey="avgScore" radius={[0, 6, 6, 0]}>
              {roles.map((r, i) => (
                <Cell key={r.jobTitle} fill={JOBTITLE_COLORS[i % JOBTITLE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoleAnalyticsSection;
