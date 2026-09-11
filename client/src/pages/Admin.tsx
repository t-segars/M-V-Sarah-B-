import { useState, useEffect } from "react";

type FlowStep = { stepNum: string; title: string; subtitle: string };
type SpecCard = { label: string; title: string; description: string };
type ScheduleRow = { tag: string; zone: string; model: string; count: string };

type SystemDetail = {
  description: string;
  flowSteps: FlowStep[];
  specs: SpecCard[];
  schedule: ScheduleRow[];
};

type VesselData = {
  drawings: string[];
  systems: { hvac: SystemDetail; electrical: SystemDetail; plumbing: SystemDetail; ancillary: SystemDetail };
};

// --- SEED DATA FROM MOCKUPS ---
const initialHVAC: SystemDetail = {
  description: "A hydronic chilled/heated water system: two central Webasto chillers circulate 25% water/glycol to 17 fan-coil air handlers.",
  flowSteps: [
    { stepNum: "01", title: "Sea chest", subtitle: "Raw-water cooling source" },
    { stepNum: "02", title: "Webasto ×2", subtitle: "Central chillers in ER" },
    { stepNum: "03", title: "25% glycol loop", subtitle: "5 bar(g) pressure rating" },
    { stepNum: "04", title: "17 air handlers", subtitle: "Hydronic fan-coil units" }
  ],
  specs: [
    { label: "CHILLER MODEL", title: "Webasto C1080 × 2", description: "Source drawing SCC-21-140-22 states C1080. Field documentation says C1085." },
    { label: "RAW-WATER PUMP", title: "74 GPM each", description: "Source drawing states Webasto W63500. Field documentation says MB2020." },
    { label: "CONFIRMED CROSSOVER", title: "ER air handlers · Slimline A18", description: "Both engine-room air handlers are confirmed Webasto Slimline A18." }
  ],
  schedule: [
    { tag: "AH-AD-1 to -4", zone: "Aft Deck", model: "A12 Compact-230V", count: "4" },
    { tag: "AH-OW-1 to -3", zone: "Owner's Stateroom", model: "A12 Compact-230V", count: "3" },
    { tag: "AH-ER-1, -2", zone: "Engine Room", model: "Webasto Slimline A18", count: "2" }
  ]
};

const initialPlumbing: SystemDetail = {
  description: "The vessel’s water systems begin at the sea chest and branch into cooling, potable, waste, fuel, and deck-service systems.",
  flowSteps: [
    { stepNum: "", title: "SEA CHEST", subtitle: "" },
    { stepNum: "", title: "SRC AQUAMATIC 700-1", subtitle: "" },
    { stepNum: "", title: "FW TANKS", subtitle: "= 1,500 gal total" },
    { stepNum: "", title: "VFD PRESSURE PUMP", subtitle: "tuned Jun 15 ✓" },
    { stepNum: "", title: "PEX DISTRIBUTION", subtitle: "" }
  ],
  specs: [
    { label: "WASTE", title: "Headhunter MSD", description: "208–230V / 80A, raw water via SCC-25, blackwater via SCC-18. | See SCC-21-140-25 ↗" },
    { label: "FUEL", title: "Four design drawings", description: "SCC-14 to -17 are not yet integrated into any as-built. Fuel sender circuits remain undocumented. | See open items ↗" },
    { label: "BILGE", title: "As-built from scratch", description: "No bilge system drawing exists in the 33-number design set. MC Marine must produce it to ABYC H-22. | Critical gap ↗" }
  ],
  schedule: [
    { tag: "Main engines ×3", zone: "3 in branch · Caterpillar", model: "SCC-21-140-21", count: "" },
    { tag: "Generators ×2", zone: "Dedicated 220V/5A · 10–14 GPM", model: "Source set", count: "" },
    { tag: "HVAC chillers", zone: "74 GPM each · raw-water cooled", model: "SCC-21-140-22", count: "" },
    { tag: "Headhunter MSD", zone: "1 in · dedicated 220V/5A · 4 GPM min", model: "SCC-21-140-25", count: "" },
    { tag: "Watermaker", zone: "3/4 in nylon · 120VAC booster pump", model: "SCC-21-140-26", count: "" },
    { tag: "Live well & deckwash", zone: "3/4 in · dedicated 220V/5A each", model: "SCC-21-140-27", count: "" },
    { tag: "Icemaker", zone: "3/4 in · routing TBC", model: "SCC-21-140-28", count: "" }
  ]
};

const initialAncillary: SystemDetail = {
  description: "These systems cross electrical, HVAC, and plumbing boundaries. They are the places where a gap can fall between projects.",
  flowSteps: [],
  specs: [],
  schedule: [
    { tag: "Sea chest", zone: "Electrical pump power · HVAC chiller cooling · Plumbing with 9 consumers", model: "AS-BUILT NOT STARTED", count: "" },
    { tag: "Bow thruster · VETUS BOWB320", zone: "48VDC bank · tunnel at frames 25–27", model: "VIP CLOSEOUT", count: "" },
    { tag: "Hamilton jets ×3", zone: "Actuators, helm controls · hull penetrations", model: "WIRING UNDOCUMENTED", count: "" },
    { tag: "Seakeeper 35", zone: "230VAC high-draw · 12V battery · raw water", model: "12V CIRCUIT OPEN", count: "" },
    { tag: "Windlass · Maxwell 560 V2", zone: "Electrical only", model: "MANUAL COMPLETE", count: "" },
    { tag: "Davit crane · Steelhead", zone: "24VDC / 208A · drip-tray drain", model: "DRAIN TBD", count: "" },
    { tag: "Fire suppression", zone: "All three trades · cable path", model: "DEFERRED", count: "" },
    { tag: "Systems & network cable paths", zone: "NMEA, WiFi, entertainment, ER-to-helm/hardtop, fire suppression", model: "G-NEW", count: "" }
  ]
};

const initialDrawings = [
  "SCC-21-140-01 | General Arrangement | 2 sheets | 2022 | Structure / GA",
  "SCC-21-140-09 | Electrical / Systems Arrangement | 10 sheets | 2022 | Electrical",
  "SCC-21-140-10 | Electrical / One-Line Diagram | 5 sheets · Rev A | 2022 | Electrical",
  "SCC-21-140-22 | HVAC System | 3 sheets | 2023 | HVAC",
  "SCC-21-140-25 | MSD Raw Water / Blackwater | 2 sheets | 2023 | Plumbing"
];

const initialElectrical: SystemDetail = {
  description: "Two independent DC worlds, a split-phase AC backbone, and four field-confirmed Victron inverters.",
  flowSteps: [],
  specs: [
    { label: "AC BACKBONE", title: "Split-phase house power", description: "Two 240VAC shore inlets and two Northern Lights 30kW generators feed a transfer switch and two 175A main panels. | SPR-1 / SPR-2 inlets, AC-MAIN-1 / AC-MAIN-2, HP-1-SP · HP-2-SP" },
    { label: "DC PLANT", title: "24V house + 48V thruster", description: "Four Victron Quattro 48|10000|140-100/100 inverters bridge the AC and DC plant from the starboard ER forward bulkhead. | 24VDC throughout, 48VDC bow-thruster bank, ER-BAT control" },
    { label: "FIELD CONFIRMATION", title: "Panel register", description: "Four panels are field-confirmed; ER-SP-DC location still carries an annotation that must be resolved. | PA-SP-1 · PA-SP-2, ER-SP-DC · ER-AUX-DC, Sync pending" }
  ],
  schedule: [
    { tag: "Bow thruster · VETUS BOWB320", zone: "48VDC · 3/0-4/0 AWG · 400-450A ANL fuse · BATSW600", model: "AS-BUILT OPEN", count: "" },
    { tag: "Windlass · Maxwell AutoAnchor 560 V2", zone: "24VDC, all-chain rode", model: "CIRCUIT ID OPEN", count: "" },
    { tag: "Davit crane · Steelhead ES2200/ES2500", zone: "24VDC, 208A peak", model: "APPROVED / PROCUREMENT", count: "" },
    { tag: "Underwater lights", zone: "UW-LTE port / starboard / forward · 14 controllers", model: "MIDSHIP IN PROGRESS", count: "" },
    { tag: "ARCO Zeus A8000-48V", zone: "External-regulator-only · up to 9,630W · Bluetooth regulator required", model: "PROCUREMENT", count: "" }
  ]
};

const emptySystem: SystemDetail = { description: "", flowSteps: [], specs: [], schedule: [] };

const defaultData: VesselData = { 
  drawings: initialDrawings, 
  systems: { hvac: initialHVAC, electrical: initialElectrical, plumbing: initialPlumbing, ancillary: initialAncillary } 
};

type SystemKey = keyof VesselData["systems"];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<VesselData>(defaultData);
  const [activeTab, setActiveTab] = useState<SystemKey | "drawings">("hvac");

  const [newFlow, setNewFlow] = useState<FlowStep>({ stepNum: "", title: "", subtitle: "" });
  const [newSpec, setNewSpec] = useState<SpecCard>({ label: "", title: "", description: "" });
  const [newRow, setNewRow] = useState<ScheduleRow>({ tag: "", zone: "", model: "", count: "" });
  const [newDrawing, setNewDrawing] = useState("");

useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data")
        .then((res) => res.json())
        .then((fetchedData) => {
          const merged = { ...fetchedData };
          let needsSave = false;

          if (!merged.systems) {
            merged.systems = defaultData.systems;
            needsSave = true;
          }
          if (!merged.systems.electrical?.specs?.length) {
            merged.systems.electrical = initialElectrical;
            needsSave = true;
          }
if (!merged.systems.plumbing?.flowSteps?.length) {
  merged.systems.plumbing = initialPlumbing;
  needsSave = true;
}
// Inside your useEffect in Admin.tsx:
if (!merged.systems.ancillary?.schedule || merged.systems.ancillary.schedule.length < 8) {
  merged.systems.ancillary = initialAncillary;
  needsSave = true;
}
          setData(merged);
          if (needsSave) saveToBackend(merged);
        });
    }
  }, [isAuthenticated]);

  const saveToBackend = async (updatedData: VesselData) => {
    await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedData) });
    setData(updatedData);
  };

  const updateSystem = (key: keyof SystemDetail, value: any) => {
    if (activeTab === "drawings") return;
    const updated = { ...data };
    (updated.systems[activeTab][key] as any) = value;
    saveToBackend(updated);
  };

  const addDrawing = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...data, drawings: [...(data.drawings || []), newDrawing] };
    saveToBackend(updated);
    setNewDrawing("");
  };

  const removeDrawing = (idx: number) => {
    const updated = { ...data, drawings: (data.drawings || []).filter((_, i) => i !== idx) };
    saveToBackend(updated);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>Admin Login</h2>
        <form onSubmit={(e) => { e.preventDefault(); if (password === "mcmarine2026") setIsAuthenticated(true); }}>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" style={{padding:"8px"}}/>
          <button type="submit" style={{padding:"8px"}}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Vessel Content Manager</h1>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {(["hvac", "electrical", "plumbing", "ancillary", "drawings"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", background: activeTab === tab ? "#0056b3" : "#e0e0e0", color: activeTab === tab ? "#fff" : "#333", border: "none" }}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
        
        {activeTab === "drawings" ? (
          <div>
            <h4>Drawing Register List</h4>
            <form onSubmit={addDrawing} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input placeholder="Document details..." value={newDrawing} onChange={(e)=>setNewDrawing(e.target.value)} style={{flex:1, padding:"8px"}} required/>
              <button type="submit" style={{padding:"8px"}}>Add Drawing</button>
            </form>
            {(data.drawings || []).map((doc, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
                <span>{doc}</span>
                <button onClick={() => removeDrawing(i)} style={{ color:"red" }}>X</button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "30px" }}>
              <h4>System Description</h4>
              <textarea value={data.systems[activeTab].description} onChange={(e) => { const updated = {...data}; updated.systems[activeTab].description = e.target.value; setData(updated); }} onBlur={() => saveToBackend(data)} style={{ width: "100%", height: "60px", padding: "10px" }} />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h4>Process Flow Steps</h4>
              <form onSubmit={(e) => { e.preventDefault(); updateSystem("flowSteps", [...data.systems[activeTab].flowSteps, newFlow]); setNewFlow({stepNum:"", title:"", subtitle:""}); }} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input placeholder="Step (e.g. 01)" value={newFlow.stepNum} onChange={(e)=>setNewFlow({...newFlow, stepNum: e.target.value})} style={{width:"100px", padding:"8px"}} required/>
                <input placeholder="Title (e.g. Sea chest)" value={newFlow.title} onChange={(e)=>setNewFlow({...newFlow, title: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Subtitle" value={newFlow.subtitle} onChange={(e)=>setNewFlow({...newFlow, subtitle: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <button type="submit" style={{padding:"8px"}}>Add Step</button>
              </form>
              {data.systems[activeTab].flowSteps.map((f, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
                  <span><strong>{f.stepNum}</strong> - {f.title} ({f.subtitle})</span>
                  <button onClick={() => updateSystem("flowSteps", data.systems[activeTab].flowSteps.filter((_, idx)=>idx!==i))} style={{ color:"red" }}>X</button>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h4>Specification Cards</h4>
              <form onSubmit={(e) => { e.preventDefault(); updateSystem("specs", [...data.systems[activeTab].specs, newSpec]); setNewSpec({label:"", title:"", description:""}); }} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input placeholder="Label" value={newSpec.label} onChange={(e)=>setNewSpec({...newSpec, label: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Title" value={newSpec.title} onChange={(e)=>setNewSpec({...newSpec, title: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Description" value={newSpec.description} onChange={(e)=>setNewSpec({...newSpec, description: e.target.value})} style={{flex:2, padding:"8px"}} required/>
                <button type="submit" style={{padding:"8px"}}>Add Card</button>
              </form>
              {data.systems[activeTab].specs.map((s, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
                  <span><strong>{s.label}:</strong> {s.title}</span>
                  <button onClick={() => updateSystem("specs", data.systems[activeTab].specs.filter((_, idx)=>idx!==i))} style={{ color:"red" }}>X</button>
                </div>
              ))}
            </div>

            <div>
              <h4>Schedule / Interface Register</h4>
              <form onSubmit={(e) => { e.preventDefault(); updateSystem("schedule", [...data.systems[activeTab].schedule, newRow]); setNewRow({tag:"", zone:"", model:"", count:""}); }} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input placeholder="Col 1 (Tag/System)" value={newRow.tag} onChange={(e)=>setNewRow({...newRow, tag: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Col 2 (Zone/Touches)" value={newRow.zone} onChange={(e)=>setNewRow({...newRow, zone: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Col 3 (Model/Status)" value={newRow.model} onChange={(e)=>setNewRow({...newRow, model: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Count (HVAC only)" value={newRow.count} onChange={(e)=>setNewRow({...newRow, count: e.target.value})} style={{width:"120px", padding:"8px"}}/>
                <button type="submit" style={{padding:"8px"}}>Add Row</button>
              </form>
              {data.systems[activeTab].schedule.map((r, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
                  <span>{r.tag} | {r.zone} | {r.model} {r.count ? `| ${r.count}` : ''}</span>
                  <button onClick={() => updateSystem("schedule", data.systems[activeTab].schedule.filter((_, idx)=>idx!==i))} style={{ color:"red" }}>X</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}