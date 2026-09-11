import { useEffect, useState } from "react";

type SpecCard = { label: string; title: string; description: string };
type ScheduleRow = { tag: string; zone: string; model: string; count: string };
type SystemDetail = { description: string; specs: SpecCard[]; schedule: ScheduleRow[] };

export default function ElectricalPage() {
  const [systemData, setSystemData] = useState<SystemDetail | null>(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.systems?.electrical) setSystemData(data.systems.electrical);
      })
      .catch(console.error);
  }, []);

  if (!systemData) return <div style={{ padding: "40px" }}>Loading Electrical data...</div>;

  // Helper to colorize status badges based on text
  const getBadgeStyle = (status: string) => {
    const text = status.toUpperCase();
    if (text.includes("OPEN")) return { background: "#fee2e2", color: "#991b1b" }; // Red
    if (text.includes("APPROVED")) return { background: "#d1fae5", color: "#065f46" }; // Green
    return { background: "#fef3c7", color: "#92400e" }; // Yellow default for procurement/progress
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px" }}>SYSTEM 01 · POWER PLANT</p>
      <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0" }}>Electrical</h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "30px" }}>{systemData.description}</p>

      {/* Standing Rule Banner */}
      <div style={{ background: "#fdf8e4", border: "1px solid #f0e6cc", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#8a6d3b" }}>Standing rule · label it correctly</h4>
        <p style={{ margin: 0, color: "#8a6d3b", fontSize: "0.95rem" }}>
          Every battery system — the 24VDC house bank and the isolated 48VDC bow-thruster bank alike — is labeled <strong>“solid state marine type.”</strong> Never use “lithium” in a drawing, schedule, or crew communication.
        </p>
      </div>

      {/* Specification Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {systemData.specs.map((spec, idx) => {
          const parts = spec.description.split(" | "); // Split description from metadata
          return (
            <div key={idx} style={{ padding: "24px", border: "1px solid #e0e0e0", borderRadius: "12px", background: "#fff" }}>
              <p style={{ textTransform: "uppercase", fontSize: "11px", color: "#888", margin: "0 0 8px 0" }}>{spec.label}</p>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "1.2rem" }}>{spec.title}</h3>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", margin: "0 0 15px 0" }}>{parts[0]}</p>
              {parts[1] && <p style={{ fontSize: "12px", color: "#999", lineHeight: "1.6", margin: 0, whiteSpace: "pre-line" }}>{parts[1].replace(/, /g, '\n')}</p>}
            </div>
          );
        })}
      </div>

      {/* Schedule Table */}
      <div style={{ padding: "30px", border: "1px solid #e0e0e0", borderRadius: "16px", background: "#fff", marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 10px 0" }}>REFERENCE</p>
        <h3 style={{ fontSize: "1.8rem", margin: "0 0 20px 0" }}>Key electrical systems</h3>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888", fontWeight: "normal" }}>SYSTEM</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888", fontWeight: "normal" }}>DETAIL</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888", fontWeight: "normal" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {systemData.schedule.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "20px 0", fontWeight: "bold", color: "#222" }}>{row.tag}</td>
                <td style={{ padding: "20px 0", color: "#555" }}>{row.zone}</td>
                <td style={{ padding: "20px 0" }}>
                  <span style={{ ...getBadgeStyle(row.model), padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold", letterSpacing: "1px" }}>
                    ● {row.model}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer aligned with business identity */}
      <div style={{ textAlign: "center", padding: "20px 0", borderTop: "1px solid #eee", color: "#888", fontSize: "12px" }}>
        <strong>The Gulf Coast Sailor LLC</strong>
        <p style={{ margin: "5px 0 0 0" }}>M/V Sarah B · Virtual owner's manual · Knowledge base v13 · Published July 2026</p>
      </div>
    </div>
  );
}