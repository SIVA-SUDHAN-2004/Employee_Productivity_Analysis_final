import React from "react";
import Card from "./Card.jsx";

const StatTile = ({ label, value, sub }) => (
  <Card className="flex flex-col gap-1">
    <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-2xl font-semibold text-slate-50">{value ?? "—"}</div>
    {sub && <div className="text-xs text-slate-500">{sub}</div>}
  </Card>
);

export default StatTile;
