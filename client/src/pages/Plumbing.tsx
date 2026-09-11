import { useEffect, useState } from "react";

type SpecCard = { label: string; title: string; description: string };
type ScheduleRow = { tag: string; zone: string; model: string; count: string };
type SystemDetail = { description: string; flowSteps: any[]; specs: SpecCard[]; schedule: ScheduleRow[] };

export default function PlumbingPage() {
  const [systemData, setSystemData] = useState<SystemDetail | null>(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.systems?.plumbing) setSystemData(data.systems.plumbing);
      })
      .catch(console.error);
  }, []);

  if (!systemData) return <div style={{ padding: "40px" }}>Loading Plumbing data...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px" }}>SYSTEM 03 · WATER, WASTE & FUEL</p>
      <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0" }}>Plumbing</h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "30px" }}>{systemData.description || "The vessel’s water systems begin at the sea chest..."}</p>

      <div style={{ background: "#fdf8e4", border: "1px solid #f0e6cc", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#8a6d3b" }}>The sea chest is the single point of failure for nine systems</h4>
        <p style={{ margin: 0, color: "#8a6d3b", fontSize: "0.95rem" }}>Its raw-water supply supports the main engines, generators, HVAC chillers, MSD, watermaker, live well, and icemaker.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {systemData.specs.map((spec, idx) => (
          <div key={idx} style={{ padding: "24px", border: "1px solid #e0e0e0", borderRadius: "12px", background: "#fff" }}>
            <p style={{ textTransform: "uppercase", fontSize: "11px", color: "#888", margin: "0 0 8px 0" }}>{spec.label}</p>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1.2rem" }}>{spec.title}</h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", margin: 0 }}>{spec.description}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px", padding: "30px", border: "1px solid #e0e0e0", borderRadius: "16px", background: "#fff" }}>
        <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 10px 0" }}>Interface Register</p>
        <h3 style={{ fontSize: "1.8rem", margin: "0 0 20px 0" }}>Raw-water consumers</h3>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888" }}>CONSUMER</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888" }}>SUPPLY / DETAIL</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888" }}>DRAWING</th>
            </tr>
          </thead>
          <tbody>
            {systemData.schedule.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "20px 0", fontWeight: "bold", color: "#222" }}>{row.tag}</td>
                <td style={{ padding: "20px 0", color: "#555" }}>{row.zone}</td>
                <td style={{ padding: "20px 0", color: "#555" }}>{row.model}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}