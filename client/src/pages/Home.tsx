export default function Home() {
  const systems = [
    { name: "Electrical", path: "/electrical", desc: "Power plant, split-phase house power, and Victron inverters." },
    { name: "HVAC", path: "/hvac", desc: "Comfort systems, Webasto chillers, and 17 air handlers." },
    { name: "Plumbing", path: "/plumbing", desc: "Water, waste, fuel, sea chest, and raw-water consumers." },
    { name: "Ancillary", path: "/ancillary", desc: "Cross-system equipment and engine room interfaces." },
    { name: "Drawings", path: "/drawings", desc: "Design register, 99 PDFs, and revision rules." },
    { name: "Admin Portal", path: "/admin", desc: "Secure gateway to manage vessel manuals and data." }
  ];

  return (
    <div style={{ padding: "50px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px", margin: 0 }}>M/V SARAH B · OWNER'S MANUAL</p>
      <h1 style={{ fontSize: "2.5rem", margin: "10px 0 10px 0", color: "#0f172a" }}>Vessel Systems Command</h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "40px" }}>
        Select a system below to view live technical documentation, specs, and operational registers managed via McMarine Services LLC.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
        {systems.map((sys, idx) => (
          <a 
            key={idx} 
            href={sys.path}
            style={{ 
              textDecoration: "none", 
              padding: "24px", 
              border: "1px solid #e2e8f0", 
              borderRadius: "12px", 
              background: "#fff", 
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              display: "block",
              transition: "transform 0.2s, border-color 0.2s"
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "1.3rem" }}>{sys.name} →</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem", lineHeight: "1.4" }}>{sys.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}