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
  systems: { hvac: SystemDetail; electrical: SystemDetail; plumbing: SystemDetail; ancillary: SystemDetail };
};

// Seed data based on M/V Sarah B documentation
const initialHVAC: SystemDetail = {
  description: "A hydronic chilled/heated water system: two central Webasto chillers circulate 25% water/glycol to 17 fan-coil air handlers.",
  flowSteps: [
    { stepNum: "01", title: "Sea chest", subtitle: "Raw-water cooling source" },
    { stepNum: "02", title: "Webasto ×2", subtitle: "Central chillers in ER" },
    { stepNum: "03", title: "25% glycol loop", subtitle: "5 bar(g) pressure rating" },
    { stepNum: "04", title: "17 air handlers", subtitle: "Hydronic fan-coil units" }
  ],
  specs: [
    { label: "CHILLER MODEL", title: "Webasto C1080 × 2", description: "Source drawing SCC-21-140-22 states C1080. Field documentation says C1085; the nameplate should govern." },
    { label: "RAW-WATER PUMP", title: "74 GPM each", description: "Source drawing states Webasto W63500. Field documentation says MB2020; verify the installed nameplate." },
    { label: "CONFIRMED CROSSOVER", title: "ER air handlers · Slimline A18", description: "Both engine-room air handlers are confirmed Webasto Slimline A18, closing the v13 “TBC” model gap." }
  ],
  schedule: [
    { tag: "AH-AD-1 to -4", zone: "Aft Deck", model: "A12 Compact-230V", count: "4" },
    { tag: "AH-OW-1 to -3", zone: "Owner's Stateroom · Lower", model: "A12 Compact-230V", count: "3" },
    { tag: "AH-BKP-1, -2", zone: "Bunkroom Port · Lower", model: "A9 Compact-230V", count: "2" },
    { tag: "AH-BKS-1, -2", zone: "Bunkroom Starboard · Lower", model: "A9 Compact-230V", count: "2" },
    { tag: "AH-SAL-1 to -3", zone: "Salon · Main", model: "A12 Compact-230V", count: "3" },
    { tag: "AH-ER-1, -2", zone: "Engine Room · ER", model: "Webasto Slimline A18", count: "2" },
    { tag: "AH-HLM-1", zone: "Helm · Main", model: "Field verify", count: "1" }
  ]
};

const emptySystem: SystemDetail = { description: "", flowSteps: [], specs: [], schedule: [] };
const defaultData: VesselData = { systems: { hvac: initialHVAC, electrical: emptySystem, plumbing: emptySystem, ancillary: emptySystem } };

type SystemKey = keyof VesselData["systems"];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<VesselData>(defaultData);
  const [activeTab, setActiveTab] = useState<SystemKey>("hvac");

  // Temporary inputs
  const [newFlow, setNewFlow] = useState<FlowStep>({ stepNum: "", title: "", subtitle: "" });
  const [newSpec, setNewSpec] = useState<SpecCard>({ label: "", title: "", description: "" });
  const [newRow, setNewRow] = useState<ScheduleRow>({ tag: "", zone: "", model: "", count: "" });

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data")
        .then((res) => res.json())
        .then((fetchedData) => {
          // If the database is completely empty (no HVAC specs), seed it with initialHVAC
          if (!fetchedData.systems?.hvac?.specs?.length) {
            setData(defaultData);
            saveToBackend(defaultData);
          } else {
            setData(fetchedData);
          }
        });
    }
  }, [isAuthenticated]);

  const saveToBackend = async (updatedData: VesselData) => {
    await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedData) });
    setData(updatedData);
  };

  const updateSystem = (key: keyof SystemDetail, value: any) => {
    const updated = { ...data };
    (updated.systems[activeTab][key] as any) = value;
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

  const sys = data.systems[activeTab];

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Vessel Content Manager</h1>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {(["hvac", "electrical", "plumbing", "ancillary"] as SystemKey[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", background: activeTab === tab ? "#0056b3" : "#e0e0e0", color: activeTab === tab ? "#fff" : "#333", border: "none" }}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
        
        {/* Description */}
        <div style={{ marginBottom: "30px" }}>
          <h4>System Description</h4>
          <textarea value={sys.description} onChange={(e) => { const updated = {...data}; updated.systems[activeTab].description = e.target.value; setData(updated); }} onBlur={() => saveToBackend(data)} style={{ width: "100%", height: "60px", padding: "10px" }} />
        </div>

        {/* Process Flow Tracker */}
        <div style={{ marginBottom: "40px" }}>
          <h4>Process Flow Steps (Dark Blue Banner)</h4>
          <form onSubmit={(e) => { e.preventDefault(); updateSystem("flowSteps", [...sys.flowSteps, newFlow]); setNewFlow({stepNum:"", title:"", subtitle:""}); }} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input placeholder="Step (e.g. 01)" value={newFlow.stepNum} onChange={(e)=>setNewFlow({...newFlow, stepNum: e.target.value})} style={{width:"100px", padding:"8px"}} required/>
            <input placeholder="Title (e.g. Sea chest)" value={newFlow.title} onChange={(e)=>setNewFlow({...newFlow, title: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Subtitle" value={newFlow.subtitle} onChange={(e)=>setNewFlow({...newFlow, subtitle: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <button type="submit" style={{padding:"8px"}}>Add Step</button>
          </form>
          {sys.flowSteps.map((f, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
              <span><strong>{f.stepNum}</strong> - {f.title} ({f.subtitle})</span>
              <button onClick={() => updateSystem("flowSteps", sys.flowSteps.filter((_, idx)=>idx!==i))} style={{ color:"red" }}>X</button>
            </div>
          ))}
        </div>

        {/* Specs */}
        <div style={{ marginBottom: "40px" }}>
          <h4>Specification Cards</h4>
          <form onSubmit={(e) => { e.preventDefault(); updateSystem("specs", [...sys.specs, newSpec]); setNewSpec({label:"", title:"", description:""}); }} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input placeholder="Label" value={newSpec.label} onChange={(e)=>setNewSpec({...newSpec, label: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Title" value={newSpec.title} onChange={(e)=>setNewSpec({...newSpec, title: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Description" value={newSpec.description} onChange={(e)=>setNewSpec({...newSpec, description: e.target.value})} style={{flex:2, padding:"8px"}} required/>
            <button type="submit" style={{padding:"8px"}}>Add Card</button>
          </form>
          {sys.specs.map((s, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
              <span><strong>{s.label}:</strong> {s.title}</span>
              <button onClick={() => updateSystem("specs", sys.specs.filter((_, idx)=>idx!==i))} style={{ color:"red" }}>X</button>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div>
          <h4>Schedule Table</h4>
          <form onSubmit={(e) => { e.preventDefault(); updateSystem("schedule", [...sys.schedule, newRow]); setNewRow({tag:"", zone:"", model:"", count:""}); }} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input placeholder="Tag" value={newRow.tag} onChange={(e)=>setNewRow({...newRow, tag: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Zone" value={newRow.zone} onChange={(e)=>setNewRow({...newRow, zone: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Model" value={newRow.model} onChange={(e)=>setNewRow({...newRow, model: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Count" value={newRow.count} onChange={(e)=>setNewRow({...newRow, count: e.target.value})} style={{width:"80px", padding:"8px"}} required/>
            <button type="submit" style={{padding:"8px"}}>Add Row</button>
          </form>
          {sys.schedule.map((r, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
              <span>{r.tag} | {r.zone} | {r.model} | {r.count}</span>
              <button onClick={() => updateSystem("schedule", sys.schedule.filter((_, idx)=>idx!==i))} style={{ color:"red" }}>X</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}