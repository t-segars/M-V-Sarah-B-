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

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px" }}>SYSTEM 04 · CROSS-SYSTEM EQUIPMENT</p>
      <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0" }}>Ancillary systems</h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "30px" }}>{systemData.description || "These systems cross electrical, HVAC, and plumbing boundaries..."}</p>

      <div style={{ background: "#f8f9fa", border: "1px solid #e9ecef", padding: "24px", borderRadius: "12px", marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 10px 0" }}>Why this tab matters</p>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem" }}>The engine room is the convergence point for all three trades.</h3>
        <p style={{ margin: 0, color: "#666" }}>Trace each piece of equipment across its power, fluid, control, and access requirements before closing a wall.</p>
      </div>

      <div style={{ padding: "30px", border: "1px solid #e0e0e0", borderRadius: "16px", background: "#fff", marginBottom: "30px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 10px 0" }}>Cross-System Register</p>
        <h3 style={{ fontSize: "1.8rem", margin: "0 0 20px 0" }}>Equipment at the interfaces</h3>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888" }}>SYSTEM</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888" }}>TOUCHES</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {systemData.schedule.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "20px 0", fontWeight: "bold", color: "#222" }}>{row.tag}</td>
                <td style={{ padding: "20px 0", color: "#555" }}>{row.zone}</td>
                <td style={{ padding: "20px 0" }}>
                  <span style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>{row.model}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#0f172a", color: "#fff", padding: "30px", borderRadius: "12px" }}>
        <h3 style={{ fontSize: "1.5rem", margin: "0 0 20px 0", fontWeight: "normal" }}>"These are not separate systems when you are standing in the engine room. They are one operating environment."</h3>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>Sarah B field guide · cross-system principle</p>
      </div>
    </div>
  );
}