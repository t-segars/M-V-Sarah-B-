import { useState, useEffect } from "react";

export default function Home() {
  const [counts, setCounts] = useState({
    devices: 76,
    drawings: 32,
    critical: 8,
    inProgress: 14,
    openItemsCount: 6,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [vesselData, setVesselData] = useState<any>(null);
  const [openItems, setOpenItems] = useState<string[]>([
    "Sea Chest",
    "Electronics & Navigation Package",
    "Hamilton Jet Drives (x3)",
    "Main Engines (2x Caterpillar)",
    "Bilge Pump System"
  ]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        setVesselData(data);
        if (data.openItems && data.openItems.length > 0) {
          setOpenItems(data.openItems);
          setCounts((prev) => ({ ...prev, critical: data.openItems.length, openItemsCount: data.openItems.length }));
        }
        if (data.drawings) {
          setCounts((prev) => ({ ...prev, drawings: data.drawings.length }));
        }
      })
      .catch(() => {});
  }, []);

  // Global Search Aggregator across all systems, specs, schedules, and drawings
  const getSearchResults = () => {
    if (!searchQuery.trim() || !vesselData) return [];
    const q = searchQuery.toLowerCase();
    const results: { title: string; category: string; link: string }[] = [];

    // Search systems (HVAC, Electrical, Plumbing, Ancillary)
    if (vesselData.systems) {
      Object.entries(vesselData.systems).forEach(([sysKey, sysVal]: [string, any]) => {
        if (sysVal.description && sysVal.description.toLowerCase().includes(q)) {
          results.push({ title: `${sysKey.toUpperCase()} Description`, category: "System Overview", link: `/${sysKey}` });
        }
        // Search Specs
        sysVal.specs?.forEach((spec: any) => {
          if (spec.title.toLowerCase().includes(q) || spec.description.toLowerCase().includes(q) || spec.label.toLowerCase().includes(q)) {
            results.push({ title: `${spec.label}: ${spec.title}`, category: `${sysKey.toUpperCase()} Spec`, link: `/${sysKey}` });
          }
        });
        // Search Schedule / Tables
        sysVal.schedule?.forEach((row: any) => {
          if (row.tag.toLowerCase().includes(q) || row.zone.toLowerCase().includes(q) || row.model.toLowerCase().includes(q)) {
            results.push({ title: `${row.tag} — ${row.zone}`, category: `${sysKey.toUpperCase()} Schedule`, link: `/${sysKey}` });
          }
        });
      });
    }

    // Search Drawings
    if (vesselData.drawings) {
      vesselData.drawings.forEach((doc: any) => {
        const docStr = typeof doc === 'string' ? doc : `${doc.drawingNum} ${doc.title} ${doc.category} ${doc.equipmentTags}`;
        if (docStr.toLowerCase().includes(q)) {
          const title = typeof doc === 'string' ? doc : `${doc.drawingNum}: ${doc.title}`;
          results.push({ title, category: "Drawing Register", link: "/drawings" });
        }
      });
    }

    return results;
  };

  const searchResults = getSearchResults();
  const filteredCriticalItems = openItems.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif", background: "#f8f9fc", color: "#1e293b" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: "260px", background: "#080e1e", color: "#94a3b8", display: "flex", flexDirection: "column", padding: "20px 15px", boxSizing: "border-box", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px", paddingBottom: "15px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ width: "28px", height: "28px", background: "#1e293b", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontWeight: "bold" }}>⚓</div>
          <div>
            <div style={{ fontSize: "9px", color: "#64748b", letterSpacing: "0.5px" }}>MC MARINE SERVICES</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>M/V Sarah B</div>
          </div>
        </div>

        <div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "1px", marginBottom: "10px", paddingLeft: "10px" }}>SYSTEMS</div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderRadius: "8px", background: "#d97706", color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>
            <span>⊞ Dashboard</span>
          </a>
          <div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "1px", margin: "15px 0 5px 10px" }}>QUICK ACCESS</div>
          <a href="/electrical" style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: "8px", color: "#cbd5e1", textDecoration: "none", fontSize: "13px" }}>⚡ Electrical</a>
          <a href="/hvac" style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: "8px", color: "#cbd5e1", textDecoration: "none", fontSize: "13px" }}>🌡️ HVAC</a>
          <a href="/plumbing" style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: "8px", color: "#cbd5e1", textDecoration: "none", fontSize: "13px" }}>💧 Plumbing</a>
          <a href="/ancillary" style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: "8px", color: "#cbd5e1", textDecoration: "none", fontSize: "13px" }}>⚙️ Ancillary</a>
          <a href="/drawings" style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: "8px", color: "#cbd5e1", textDecoration: "none", fontSize: "13px" }}>📐 Drawings</a>
          
          <a href="/admin" style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: "8px", color: "#f59e0b", textDecoration: "none", fontSize: "13px", marginTop: "20px", border: "1px dashed #334155" }}>
            ⚙️ Admin Portal
          </a>
        </div>

        <div style={{ fontSize: "10px", color: "#475569", borderTop: "1px solid #1e293b", paddingTop: "15px" }}>
          <div>Systems Dashboard</div>
          <div>Knowledge base v13</div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: "35px 45px", overflowY: "auto" }}>
        
        {/* TOP HEADER WITH GLOBAL SEARCH BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", position: "relative" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "0.5px", marginBottom: "4px" }}>VESSEL SYSTEMS DASHBOARD</div>
            <h1 style={{ fontSize: "2rem", margin: "0 0 8px 0", color: "#0f172a", fontWeight: "800" }}>M/V Sarah B</h1>
            <p style={{ fontSize: "0.95rem", color: "#64748b", maxWidth: "650px", margin: 0, lineHeight: "1.5" }}>
              A living registry of every tagged system aboard — browse by category, search any device, and pull up its specs, manuals, how-to guides, and maintenance history.
            </p>
          </div>

          {/* Global Search Input & Dropdown Results */}
          <div style={{ position: "relative", width: "320px" }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all components, specs, drawings..." 
              style={{
                width: "100%",
                padding: "10px 14px 10px 36px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#fff",
                fontSize: "13px",
                outline: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                boxSizing: "border-box"
              }}
            />
            <span style={{ position: "absolute", left: "12px", top: "11px", color: "#94a3b8", fontSize: "14px" }}>🔍</span>

            {/* Live Dropdown Results */}
            {searchQuery.trim().length > 0 && (
              <div style={{
                position: "absolute",
                top: "45px",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                maxHeight: "350px",
                overflowY: "auto",
                zIndex: 100,
                padding: "8px 0"
              }}>
                <div style={{ padding: "6px 14px", fontSize: "10px", color: "#64748b", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9" }}>
                  GLOBAL SEARCH RESULTS ({searchResults.length})
                </div>
                {searchResults.length === 0 ? (
                  <div style={{ padding: "12px 14px", fontSize: "12px", color: "#94a3b8" }}>No matching components or drawings found.</div>
                ) : (
                  searchResults.map((res, idx) => (
                    <a 
                      key={idx} 
                      href={res.link}
                      style={{
                        display: "block",
                        padding: "10px 14px",
                        textDecoration: "none",
                        borderBottom: "1px solid #f8fafc",
                        transition: "background 0.1s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ fontSize: "13px", fontWeight: "bold", color: "#0f172a" }}>{res.title}</div>
                      <div style={{ fontSize: "11px", color: "#2563eb", marginTop: "2px" }}>{res.category}</div>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* TOP METRIC CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "25px" }}>
          <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ background: "#0f172a", color: "#fff", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>⚡</div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#0f172a" }}>{counts.devices}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Devices Logged</div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ background: "#d97706", color: "#fff", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>📐</div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#0f172a" }}>{counts.drawings}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Drawings</div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ background: "#dc2626", color: "#fff", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>⚠️</div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#0f172a" }}>{counts.critical}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Critical Items</div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ background: "#ea580c", color: "#fff", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>⏳</div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#0f172a" }}>{counts.inProgress}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>In Progress</div>
            </div>
          </div>
        </div>

        {/* VESSEL PROFILE & STEERING ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "20px", marginBottom: "25px" }}>
          <div style={{ background: "#0f172a", color: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "1px", marginBottom: "6px" }}>VESSEL PROFILE</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc", marginBottom: "18px" }}>SCC Marine LLC · Stuart Chatsworth · Fort Myers, FL</div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", borderTop: "1px solid #1e293b", paddingTop: "15px" }}>
              <div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>LOA</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>23.78 m</div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>78 ft</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>BEAM</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>7.00 m</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>DRAFT</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>0.915 m</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>DISPLACEMENT</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>57.700 kg</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>HULL</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>Aluminum Deep V</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>POWER</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>3 × Cat + 3 × Hamilton</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px", marginBottom: "10px", fontWeight: "bold" }}>STABILIZATION & STEERING</div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#334155", lineHeight: "1.7" }}>
              <li><strong>Seakeeper 35</strong> gyrostabilizer</li>
              <li><strong>3x Hamilton Jets</strong> — no shafts, no rudders</li>
              <li><strong>Bow thruster</strong> as-built undocumented critical before VIP closeout</li>
            </ul>
          </div>
        </div>

        {/* BROWSE BY SYSTEM */}
        <div style={{ marginBottom: "25px" }}>
          <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px", marginBottom: "12px", fontWeight: "bold" }}>BROWSE BY SYSTEM</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px" }}>
            <a href="/electrical" style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>⚡</div>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>Electrical</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>12 docus</div>
            </a>
            <a href="/hvac" style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>🌡️</div>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>HVAC</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>22 docus</div>
            </a>
            <a href="/plumbing" style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>💧</div>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>Plumbing</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "lowercase" }}>14 docus</div>
            </a>
            <a href="/electrical" style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>⚓</div>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>Propulsion</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>8 docus</div>
            </a>
            <a href="/ancillary" style={{ background: "#fff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>⚙️</div>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>Ancillary</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>4 docus</div>
            </a>
          </div>
        </div>

        {/* CRITICAL ATTENTION & RECENT ACTIVITY */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>Critical Attention</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{filteredCriticalItems.length} items →</div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              {filteredCriticalItems.length === 0 && <div style={{ color: "#94a3b8", fontSize: "12px" }}>No matching critical items found.</div>}
              {filteredCriticalItems.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#dc2626", marginRight: "10px" }}>●</span>
                  <span style={{ flex: 1, fontWeight: "500" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a", marginBottom: "15px" }}>Recent Activity</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "12px", color: "#334155", lineHeight: "1.4" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ color: "#16a34a" }}>✓</span>
                <div>
                  <div>42-day Ganti window begins (Aug 10 - Sep 23). Target: Gate 1 (low Ready / Heat List). Chiller system test week Sep 14-18.</div>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>2026-08-10 · Field verification</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ color: "#16a34a" }}>✓</span>
                <div>
                  <div>Davit crane documented in electrical takeoff — DC 1 circuit 3 24VDC 208A breaker. Matches brown 208A peak spec.</div>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>2026-07-30 · Takeoff update</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}