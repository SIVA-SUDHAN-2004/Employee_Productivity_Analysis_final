import React, { useMemo } from "react";
import { useEmployee } from "../context/EmployeeContext.jsx";
import Card from "../components/Common/Card.jsx";

// Chart components
import ProductivityDistributionChart from "../components/Charts/ProductivityDistributionChart.jsx";
import DeptAvgProductivityBar from "../components/Charts/DeptAvgProductivityBar.jsx";
import HoursVsScoreScatter from "../components/Charts/HoursVsScoreScatter.jsx";
import ExperienceVsProductivityLine from "../components/Charts/ExperienceVsProductivityLine.jsx";
import RoleRadarChart from "../components/Charts/RoleRadarChart.jsx";
import TasksOvertimeByRole from "../components/Charts/TasksOvertimeByRole.jsx";
import DeptPieChart from "../components/Charts/DeptPieChart.jsx";
import AbsenceVsProductivityArea from "../components/Charts/AbsenceVsProductivityArea.jsx";
import AgeProductivityComposed from "../components/Charts/AgeProductivityComposed.jsx";
import TopBottomEmployeesChart from "../components/Charts/TopBottomEmployeesChart.jsx";
import RoleAnalyticsSection from "../components/Charts/RoleAnalyticsSection.jsx";
import DeptTopPerformersMatrix from "../components/Charts/DeptTopPerformersMatrix.jsx";

// ── Styled helpers ────────────────────────────────────────────────────────────

const SectionHeader = ({ title, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontSize: 17, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>{sub}</p>}
  </div>
);

const ChartCard = ({ title, sub, children, span = 1 }) => (
  <div style={{ gridColumn: `span ${span}` }}>
    <Card>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </Card>
  </div>
);

const KpiTile = ({ label, value, accent, icon }) => (
  <Card>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${accent}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginTop: 2 }}>{value ?? "—"}</div>
      </div>
    </div>
  </Card>
);

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "32px 0 20px" }}>
    <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
    <span style={{
      fontSize: 11, fontWeight: 700, color: "#475569",
      textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap"
    }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
  </div>
);

// ── AnalyticsPage ─────────────────────────────────────────────────────────────

const AnalyticsPage = () => {
  const { employees } = useEmployee();

  const scored = useMemo(
    () => employees.filter((e) => e.productivityScore > 0 && isFinite(e.productivityScore)),
    [employees]
  );

  const kpis = useMemo(() => {
    if (scored.length === 0) return null;
    const scores = scored.map((e) => e.productivityScore);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const sorted = [...scored].sort((a, b) => b.productivityScore - a.productivityScore);
    const depts = new Set(employees.map((e) => e.department).filter(Boolean));
    return {
      avg: avg.toFixed(1),
      top: sorted[0],
      bottom: sorted[sorted.length - 1],
      total: employees.length,
      predicted: scored.length,
      departments: depts.size,
    };
  }, [employees, scored]);

  const hasPredictions = scored.length > 0;

  if (employees.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 12 }}>
        <div style={{ fontSize: 48 }}>📊</div>
        <h2 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 18, margin: 0 }}>No Data Yet</h2>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0, textAlign: "center", maxWidth: 380 }}>
          Upload a CSV in the <strong style={{ color: "#818cf8" }}>Upload CSV</strong> tab, then click <strong style={{ color: "#34d399" }}>⚡ Predict All</strong> to generate analytics.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
          📊 Analytics Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "6px 0 0" }}>
          {hasPredictions
            ? `Showing insights from ${scored.length.toLocaleString()} predicted employees across ${kpis?.departments ?? "—"} departments.`
            : `${employees.length.toLocaleString()} employees loaded — run ⚡ Predict All to unlock all charts.`}
        </p>
      </div>

      {/* ── KPIs ── */}
      {kpis && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          <KpiTile icon="⚡" label="Avg Productivity" value={kpis.avg} accent="#6366f1" />
          <KpiTile icon="🏆" label="Top Performer" value={kpis.top?.name || kpis.top?.employeeId} accent="#22c55e" />
          <KpiTile icon="📉" label="Needs Attention" value={kpis.bottom?.name || kpis.bottom?.employeeId} accent="#ef4444" />
          <KpiTile icon="👥" label="Total Employees" value={employees.length.toLocaleString()} accent="#0ea5e9" />
          <KpiTile icon="🏢" label="Departments" value={kpis.departments} accent="#f59e0b" />
        </div>
      )}

      {!hasPredictions && (
        <div style={{
          padding: "18px 22px", borderRadius: 14, marginBottom: 28,
          background: "#fbbf2410", border: "1px solid #fbbf2430",
          color: "#fbbf24", fontSize: 13
        }}>
          ⚠️ Predictions not yet run. Charts will appear after you click <strong>⚡ Predict Productivity for All</strong> in the Upload CSV tab.
        </div>
      )}

      {/* ── Charts Grid ── */}
      <Divider label="Productivity Overview" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ChartCard
          title="Score Distribution"
          sub="How many employees fall in each productivity band"
        >
          <ProductivityDistributionChart employees={employees} />
        </ChartCard>

        <ChartCard
          title="Top 5 vs Bottom 5"
          sub="Highest and lowest performers (green = top, red = bottom)"
        >
          <TopBottomEmployeesChart employees={employees} />
        </ChartCard>
      </div>

      <Divider label="Department Insights" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ChartCard
          title="Employee Distribution by Department"
          sub="Headcount share across departments"
        >
          <DeptPieChart employees={employees} />
        </ChartCard>

        <ChartCard
          title="Avg Productivity by Department"
          sub="Ranked from highest to lowest average score"
        >
          <DeptAvgProductivityBar employees={employees} />
        </ChartCard>
      </div>

      <Divider label="Top Talent by Department" />
      <div style={{ marginBottom: 16 }}>
        <ChartCard 
          title="Department Leaderboards (Top 5)" 
          sub="The highest-scored employees in each department based on ML predictions."
          span={2}
        >
          <DeptTopPerformersMatrix employees={employees} />
        </ChartCard>
      </div>

      <Divider label="Work Habits & Patterns" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ChartCard
          title="Hours/Day vs Productivity"
          sub="Correlation between daily hours worked and score"
        >
          <HoursVsScoreScatter employees={employees} />
        </ChartCard>

        <ChartCard
          title="Absence Impact on Productivity"
          sub="How absenteeism correlates with avg productivity"
        >
          <AbsenceVsProductivityArea employees={employees} />
        </ChartCard>

        <ChartCard
          title="Experience vs Productivity"
          sub="Average score grouped by years of experience"
        >
          <ExperienceVsProductivityLine employees={employees} />
        </ChartCard>

        <ChartCard
          title="Age Group Analysis"
          sub="Employee count (bars) vs avg score (line) by age bracket"
        >
          <AgeProductivityComposed employees={employees} />
        </ChartCard>
      </div>

      {/* ── Role-Based Section ── */}
      <Divider label="Role-Based Analytics" />

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <ChartCard
            title="Tasks & Overtime by Role"
            sub="Avg tasks completed per week vs overtime hours by role"
          >
            <TasksOvertimeByRole employees={employees} />
          </ChartCard>

          <ChartCard
            title="Role Performance Radar"
            sub="Multi-dimensional comparison across top roles"
          >
            <RoleRadarChart employees={employees} />
          </ChartCard>
        </div>

        <Card>
          <SectionHeader
            title="🎯 Deep Dive: Role-Based Analytics"
            sub="Click a role to see its detailed breakdown and radar profile"
          />
          <RoleAnalyticsSection employees={employees} />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
