import { useEffect, useState } from "react";

type FlowStep = { stepNum: string; title: string; subtitle: string };
type SpecCard = { label: string; title: string; description: string };
type ScheduleRow = { tag: string; zone: string; model: string; count: string };
type SystemDetail = { description: string; flowSteps: FlowStep[]; specs: SpecCard[]; schedule: ScheduleRow[] };

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
      <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0", color: "#001f3f" }}>Plumbing</h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "30px" }}>{systemData.description}</p>

      {/* Point of Failure Banner */}
      <div style={{ background: "#fdf8e4", border: "1px solid #f0e6cc", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#8a6d3b" }}>The sea chest is the single point of failure for nine systems</h4>
        <p style={{ margin: 0, color: "#8a6d3b", fontSize: "0.95rem", lineHeight: "1.5" }}>
          Its raw-water supply supports the main engines, generators, HVAC chillers, MSD, watermaker, live well and deckwash, and icemaker. Keep the sea chest, strainers, and downstream shutoffs in the crew's first-response mental model.
        </p>
      </div>

      {/* Process Flow Tracker: Fresh-Water Loop */}
      {systemData.flowSteps && systemData.flowSteps.length > 0 && (
        <div style={{ border: "1px solid #d1fae5", padding: "24px", borderRadius: "12px", marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#9ca3af", textTransform: "uppercase", margin: "0 0 5px 0" }}>FRESH-WATER LOOP</p>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "1.4rem", color: "#111827" }}>From source to point of use</h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            {systemData.flowSteps.map((step, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ border: "1px solid #e5e7eb", padding: "10px 16px", borderRadius: "8px", background: "#fff", minWidth: "100px", textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#374151", fontFamily: "monospace", letterSpacing: "0.5px" }}>{step.title}</div>
                  {step.subtitle && <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "4px" }}>{step.subtitle}</div>}
                </div>
                {idx < systemData.flowSteps.length - 1 && <span style={{ color: "#9ca3af", fontSize: "20px" }}>{'>'}</span>}
              </div>
            ))}
          </div>
          <p style={{ margin: 0, color: "#059669", fontSize: "12px", fontWeight: "bold" }}>✓ PEX pressure test passed June 9, 2026</p>
        </div>
      )}

      {/* Spec Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {systemData.specs.map((spec, idx) => {
          const parts = spec.description.split(" | "); // Separates standard text from the link text
          return (
            <div key={idx} style={{ padding: "24px", border: "1px solid #e0e0e0", borderRadius: "12px", background: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ textTransform: "uppercase", fontSize: "11px", color: "#888", margin: "0 0 8px 0", letterSpacing: "1px" }}>{spec.label}</p>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.2rem", color: "#1f2937" }}>{spec.title}</h3>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5", margin: "0 0 20px 0" }}>{parts[0]}</p>
              </div>
              {parts[1] && <p style={{ fontSize: "13px", color: "#2563eb", margin: 0 }}>{parts[1]}</p>}
            </div>
          );
        })}
      </div>

      {/* Interface Register Table */}
      <div style={{ padding: "30px", border: "1px solid #e0e0e0", borderRadius: "16px", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "15px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 5px 0" }}>INTERFACE REGISTER</p>
            <h3 style={{ fontSize: "1.8rem", margin: 0, color: "#111827" }}>Raw-water consumers</h3>
          </div>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, fontFamily: "monospace" }}>9 sea chest branches</p>
        </div>
        
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 0", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>CONSUMER</th>
              <th style={{ padding: "10px 0", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>SUPPLY / DETAIL</th>
              <th style={{ padding: "10px 0", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>DRAWING</th>
            </tr>
          </thead>
          <tbody>
            {systemData.schedule.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f9fafb" }}>
                <td style={{ padding: "20px 0", fontWeight: "bold", color: "#1f2937", fontSize: "14px" }}>{row.tag}</td>
                <td style={{ padding: "20px 0", color: "#6b7280", fontSize: "14px" }}>{row.zone}</td>
                <td style={{ padding: "20px 0", color: "#6b7280", fontSize: "14px" }}>{row.model}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}