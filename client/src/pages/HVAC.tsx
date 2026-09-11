import { useEffect, useState } from "react";

// 1. Define the matching data types
type SpecCard = { label: string; title: string; description: string };
type ScheduleRow = { tag: string; zone: string; model: string; count: string };
type SystemDetail = { description: string; specs: SpecCard[]; schedule: ScheduleRow[] };

export default function HVACPage() {
  const [systemData, setSystemData] = useState<SystemDetail | null>(null);

  // 2. Fetch the data on component load
  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((fetchedData) => {
        // Target the specific system data (e.g., HVAC)
        if (fetchedData.systems && fetchedData.systems.hvac) {
          setSystemData(fetchedData.systems.hvac);
        }
      })
      .catch(console.error);
  }, []);

  if (!systemData) return <div style={{ padding: "40px" }}>Loading HVAC data...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px" }}>SYSTEM 02 · COMFORT SYSTEMS</p>
      <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0" }}>HVAC</h1>
      
      {/* Render the System Description */}
      <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.6" }}>
        {systemData.description}
      </p>

      {/* Render the Specification Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "40px" }}>
        {systemData.specs.map((spec, idx) => (
          <div key={idx} style={{ padding: "24px", border: "1px solid #e0e0e0", borderRadius: "16px", background: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <p style={{ textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px", color: "#888", margin: "0 0 8px 0" }}>
              {spec.label}
            </p>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1.2rem", color: "#111" }}>
              {spec.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", margin: 0 }}>
              {spec.description}
            </p>
          </div>
        ))}
      </div>

      {/* Render the Schedule Table */}
      <div style={{ marginTop: "40px", padding: "30px", border: "1px solid #e0e0e0", borderRadius: "16px", background: "#fff" }}>
        <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 10px 0" }}>
          17-Unit Schedule
        </p>
        <h3 style={{ fontSize: "1.8rem", margin: "0 0 20px 0" }}>Air handler zones</h3>
        
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888", fontWeight: "normal" }}>TAG</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888", fontWeight: "normal" }}>ZONE / DECK</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888", fontWeight: "normal" }}>MODEL</th>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888", fontWeight: "normal" }}>COUNT</th>
            </tr>
          </thead>
          <tbody>
            {systemData.schedule.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "20px 0", fontWeight: "bold", color: "#222" }}>{row.tag}</td>
                <td style={{ padding: "20px 0", color: "#555" }}>{row.zone}</td>
                <td style={{ padding: "20px 0", color: "#555" }}>{row.model}</td>
                <td style={{ padding: "20px 0", color: "#555" }}>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}