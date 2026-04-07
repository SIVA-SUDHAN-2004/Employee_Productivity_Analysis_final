import React, { useMemo } from "react";

const DeptTopPerformersMatrix = ({ employees }) => {
  const depts = useMemo(() => {
    // 1. Filter out uncategorized or unscored employees
    const valid = employees.filter(e => e.department && e.productivityScore > 0);
    
    // 2. Group by department
    const groups = {};
    valid.forEach(e => {
      const dept = e.department;
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(e);
    });

    // 3. Sort each group's members by productivityScore descending, slice top 5
    const processed = Object.keys(groups).map(dept => {
      const top5 = groups[dept]
        .sort((a, b) => b.productivityScore - a.productivityScore)
        .slice(0, 5);
      return { dept, top5 };
    });

    // 4. Sort departments alphabetically
    processed.sort((a, b) => a.dept.localeCompare(b.dept));

    return processed;
  }, [employees]);

  if (depts.length === 0) return <div className="text-slate-500 text-sm p-4">No department data available.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-2 pb-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent" }}>
      {depts.map((d) => (
        <div key={d.dept} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/50 pb-2">
            <h3 className="font-semibold text-slate-200 text-[13px] truncate pr-2">{d.dept}</h3>
            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded shadow-sm whitespace-nowrap">TOP 5</span>
          </div>
          <div className="space-y-2.5 flex-1">
            {d.top5.map((emp, idx) => (
              <div key={emp._id || emp.employeeId || idx} className="flex flex-col group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className={`text-[10px] font-extrabold w-[18px] h-[18px] flex items-center justify-center rounded-full flex-shrink-0 ${idx === 0 ? 'bg-amber-500/20 text-amber-500' : idx === 1 ? 'bg-slate-300/20 text-slate-300' : idx === 2 ? 'bg-orange-700/20 text-orange-400' : 'bg-slate-800 text-slate-500'}`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-300 font-medium truncate group-hover:text-white transition-colors duration-200">
                      {emp.name || emp.employeeId || "Unknown"}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-emerald-400 ml-2 group-hover:text-emerald-300 transition-colors">
                    {Number(emp.productivityScore).toFixed(2)}
                  </div>
                </div>
                {/* Thin subtle bar indicating relative distance from perfect 5.0 */}
                <div className="w-full h-1 bg-slate-950 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-indigo-500/50 rounded-full" style={{ width: `${(emp.productivityScore / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeptTopPerformersMatrix;
