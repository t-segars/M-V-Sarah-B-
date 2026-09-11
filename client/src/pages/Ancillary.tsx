import { useEffect, useState } from "react";

type ScheduleRow = { tag: string; zone: string; model: string; count: string };
type SystemDetail = { description: string; schedule: ScheduleRow[] };

export default function AncillaryPage() {
  const [systemData, setSystemData] = useState<SystemDetail | null>(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.systems?.ancillary) setSystemData(data.systems.ancillary);
      })
      .catch(console.error);
  }, []);

  if (!systemData) return <div style={{ padding: "40px" }}>Loading Ancillary data...</div>;

  // Dynamic styling for status badges based on text matching
  const getBadgeStyle = (status: string) => {
    const text = status.toUpperCase();
    if (text.includes("COMPLETE")) return { background: "#d1fae5", color: "#065f46" }; // Green
    if (text.includes("DEFERRED")) return { background: "#f3f4f6", color: "#4b5563" }; // Grey
    if (text.includes("OPEN") || text.includes("TBD") || text.includes("PROGRESS")) return { background: "#fef3c7", color: "#92400e" }; // Yellow
    return { background: "#fee2e2", color: "#991b1b" }; // Red (default for unstarted/undocumented/closeout)
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px" }}>SYSTEM 04 · CROSS-SYSTEM EQUIPMENT</p>
      <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0", color: "#0f172a" }}>Ancillary systems</h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "30px", lineHeight: "1.5" }}>{systemData.description}</p>

      {/* Why this tab matters Banner */}
      <div style={{ background: "#fdf8fa", border: "1px solid #fce7f3", padding: "24px", borderRadius: "12px", marginBottom: "40px", display: "flex", gap: "20px" }}>
        <div style={{ background: "#fce7f3", borderRadius: "8px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: "20px", height: "20px", border: "2px solid #831843", borderRadius: "4px", borderLeftWidth: "6px" }}></div>
        </div>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#9ca3af", textTransform: "uppercase", margin: "0 0 5px 0" }}>WHY THIS TAB MATTERS</p>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", color: "#111827" }}>The engine room is the convergence point for all three trades.</h3>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.95rem" }}>Trace each piece of equipment across its power, fluid, control, and access requirements before closing a wall or cabin.</p>
        </div>
      </div>

      {/* Interface Register Table */}
      <div style={{ padding: "30px", border: "1px solid #e2e8f0", borderRadius: "16px", background: "#fff", marginBottom: "30px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#9ca3af", textTransform: "uppercase", margin: "0 0 10px 0" }}>CROSS-SYSTEM REGISTER</p>
        <h3 style={{ fontSize: "1.8rem", margin: "0 0 20px 0", color: "#0f172a" }}>Equipment at the interfaces</h3>
        
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "15px", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>SYSTEM</th>
              <th style={{ padding: "15px", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>TOUCHES</th>
              <th style={{ padding: "15px", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {systemData.schedule.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "20px 15px", fontWeight: "bold", color: "#1e293b", fontSize: "14px" }}>{row.tag}</td>
                <td style={{ padding: "20px 15px", color: "#64748b", fontSize: "14px" }}>{row.zone}</td>
                <td style={{ padding: "20px 15px" }}>
                  <span style={{ ...getBadgeStyle(row.model), padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                    ● {row.model}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}