import { useState, useEffect } from "react";

export default function Home() {
  const [openItemsCount, setOpenItemsCount] = useState(6);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.openItems) setOpenItemsCount(data.openItems.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", background: "#f8fafc" }}>
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <div style={{ width: "280px", background: "#0b1329", color: "#fff", display: "flex", flexDirection: "column", padding: "20px", boxSizing: "border-box", borderRight: "1px solid #1e293b" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", borderBottom: "1px solid #1e293b", paddingBottom: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", border: "1px solid #d4af37", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4af37" }}>
              ⚓
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "#94a3b8", letterSpacing: "1px" }}>OWNER'S MANUAL</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>M/V Sarah B</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px", marginBottom: "15px" }}>VESSEL SYSTEMS</div>

        {/* Nav Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "10px", background: "#1e293b", color: "#fff", textDecoration: "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#d4af37" }}>Overview</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Start here</div>
            </div>
            <span>›</span>
          </a>

          <a href="/electrical" style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "10px", color: "#cbd5e1", textDecoration: "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>Electrical</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Power plant</div>
            </div>
          </a>

          <a href="/hvac" style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "10px", color: "#cbd5e1", textDecoration: "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>HVAC</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Comfort systems</div>
            </div>
          </a>

          <a href="/plumbing" style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "10px", color: "#cbd5e1", textDecoration: "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>Plumbing</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Water & waste</div>
            </div>
          </a>

          <a href="/ancillary" style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "10px", color: "#cbd5e1", textDecoration: "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>Ancillary</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Cross-system</div>
            </div>
          </a>

          <a href="/drawings" style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "10px", color: "#cbd5e1", textDecoration: "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>Drawings</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Design register</div>
            </div>
          </a>

          <a href="/admin" style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "10px", color: "#d4af37", textDecoration: "none", marginTop: "auto", border: "1px dashed #334155" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>Admin Portal ⚙️</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Manage vessel data</div>
            </div>
          </a>
        </div>

      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: "50px", overflowY: "auto" }}>
        <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px", margin: 0 }}>SYSTEM 00 · WELCOME</p>
        <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0", color: "#0f172a" }}>M/V Sarah B</h1>
        <p style={{ fontSize: "1.2rem", color: "#475569", lineHeight: "1.6", maxWidth: "700px", marginBottom: "40px" }}>
          Welcome to the custom digital owner's manual. Use the sidebar on the left to navigate through electrical, HVAC, plumbing, cross-system ancillary equipment, and the complete engineering drawing register.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", maxWidth: "900px" }}>
          <a href="/electrical" style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>Electrical System →</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>View split-phase house power, Victron inverters, and the panel register.</p>
          </a>
          <a href="/hvac" style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>HVAC System →</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Explore Webasto chillers, glycol loops, and the 17-unit air handler schedule.</p>
          </a>
          <a href="/plumbing" style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>Plumbing & Waste →</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Inspect sea chest branches, fresh-water loops, and raw-water consumers.</p>
          </a>
          <a href="/drawings" style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>Drawings Register →</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Access the complete SCC-21-140 drawing set and revision rules.</p>
          </a>
        </div>
      </div>

    </div>
  );
}