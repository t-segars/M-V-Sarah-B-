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

type DrawingEntry = {
  drawingNum: string;
  title: string;
  sheets: string;
  date: string;
  category: string;
  equipmentTags: string;
  pdfUrl: string;
};

type VesselData = {
  drawings: DrawingEntry[];
  systems: { hvac: SystemDetail; electrical: SystemDetail; plumbing: SystemDetail; ancillary: SystemDetail };
};

const initialDrawings: DrawingEntry[] = [
  { drawingNum: "SCC-21-140-01", title: "General Arrangement", sheets: "2", date: "2022", category: "Structure / GA", equipmentTags: "General", pdfUrl: "" },
  { drawingNum: "SCC-21-140-07", title: "Engine Room Arrangement", sheets: "4", date: "2022", category: "ER Layout", equipmentTags: "Engine Room", pdfUrl: "" },
  { drawingNum: "SCC-21-140-09", title: "Electrical / Systems Arrangement", sheets: "10", date: "2022", category: "Electrical", equipmentTags: "Electrical Backbone", pdfUrl: "" },
  { drawingNum: "SCC-21-140-10", title: "Electrical / One-Line Diagram", sheets: "5 · Rev A", date: "2022", category: "Electrical", equipmentTags: "Inverters, Generators", pdfUrl: "" },
  { drawingNum: "SCC-21-140-18", title: "Potable Water System", sheets: "3", date: "2023", category: "Plumbing", equipmentTags: "Fresh-water loop, Sea chest", pdfUrl: "" },
  { drawingNum: "SCC-21-140-22", title: "HVAC System", sheets: "3", date: "2023", category: "HVAC", equipmentTags: "Chillers, Air handlers", pdfUrl: "" }
];

const emptySystem: SystemDetail = { description: "", flowSteps: [], specs: [], schedule: [] };

const defaultData: VesselData = { 
  drawings: initialDrawings, 
  systems: { hvac: emptySystem, electrical: emptySystem, plumbing: emptySystem, ancillary: emptySystem } 
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
  const [newDrawing, setNewDrawing] = useState<DrawingEntry>({ drawingNum: "", title: "", sheets: "", date: "", category: "", equipmentTags: "", pdfUrl: "" });

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
          if (!merged.drawings || typeof merged.drawings[0] === 'string') {
            merged.drawings = initialDrawings;
            needsSave = true;
          }

          setData(merged);
          if (needsSave) saveToBackend(merged);
        })
        .catch(() => setData(defaultData));
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
      
      {/* MASS JSON GOOGLE SHEET UPLOADER */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#166534", fontSize: "1.1rem" }}>Bulk Update from Google Sheet (JSON)</h3>
        <p style={{ margin: "0 0 15px 0", color: "#15803d", fontSize: "0.9rem" }}>
          Export your Google Sheet as a JSON file matching the vessel schema, then upload it here to instantly update all components, specs, schedules, and drawings app-wide.
        </p>
        <input 
          type="file" 
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
              try {
                const jsonContent = JSON.parse(event.target?.result as string);
                const res = await fetch("/api/data", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(jsonContent)
                });
                if (res.ok) {
                  alert("Success! App mass-updated from Google Sheet JSON.");
                  window.location.reload();
                } else {
                  alert("Failed to update server data.");
                }
              } catch (err) {
                alert("Invalid JSON file format.");
              }
            };
            reader.readAsText(file);
          }}
          style={{ padding: "8px", background: "#fff", border: "1px solid #d1d5db", borderRadius: "6px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {(["hvac", "electrical", "plumbing", "ancillary", "drawings"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", background: activeTab === tab ? "#0056b3" : "#e0e0e0", color: activeTab === tab ? "#fff" : "#333", border: "none", cursor: "pointer" }}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
        {activeTab === "drawings" ? (
          <div>
            <h4>Drawing Register List</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const updated = { ...data, drawings: [...(data.drawings || []), newDrawing] };
              saveToBackend(updated);
              setNewDrawing({ drawingNum: "", title: "", sheets: "", date: "", category: "", equipmentTags: "", pdfUrl: "" });
            }} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px", background: "#fff", padding: "15px", border: "1px solid #ddd" }}>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <input placeholder="Drawing # (e.g. SCC-21-140-01)" value={newDrawing.drawingNum} onChange={(e)=>setNewDrawing({...newDrawing, drawingNum: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Title" value={newDrawing.title} onChange={(e)=>setNewDrawing({...newDrawing, title: e.target.value})} style={{flex:2, padding:"8px"}} required/>
                <input placeholder="Sheets" value={newDrawing.sheets} onChange={(e)=>setNewDrawing({...newDrawing, sheets: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Date" value={newDrawing.date} onChange={(e)=>setNewDrawing({...newDrawing, date: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Category" value={newDrawing.category} onChange={(e)=>setNewDrawing({...newDrawing, category: e.target.value})} style={{flex:1, padding:"8px"}} required/>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <input placeholder="Equipment Tags (comma separated)" value={newDrawing.equipmentTags} onChange={(e)=>setNewDrawing({...newDrawing, equipmentTags: e.target.value})} style={{flex:2, padding:"8px"}} />
                <input placeholder="PDF URL / Filename" value={newDrawing.pdfUrl} onChange={(e)=>setNewDrawing({...newDrawing, pdfUrl: e.target.value})} style={{flex:2, padding:"8px"}} />
                <button type="submit" style={{padding:"8px 16px", background: "#0056b3", color: "#fff", border: "none", cursor: "pointer"}}>Add Drawing</button>
              </div>
            </form>

            {(data.drawings || []).map((doc, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"15px", border:"1px solid #ddd", marginBottom:"5px" }}>
                <div>
                  <strong>{doc.drawingNum}</strong> - {doc.title} ({doc.category}) <br/>
                  <small style={{ color: "#666" }}>Tags: {doc.equipmentTags || "None"}</small>
                </div>
                <button onClick={() => {
                  const updated = { ...data, drawings: data.drawings.filter((_, idx) => idx !== i) };
                  saveToBackend(updated);
                }} style={{ color:"red", alignSelf: "center", border: "none", background: "none", cursor: "pointer" }}>X</button>
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
                <input placeholder="Step (e.g. 01)" value={newFlow.stepNum} onChange={(e)=>setNewFlow({...newFlow, stepNum: e.target.value})} style={{width:"100px", padding:"8px"}}/>
                <input placeholder="Title" value={newFlow.title} onChange={(e)=>setNewFlow({...newFlow, title: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Subtitle" value={newFlow.subtitle} onChange={(e)=>setNewFlow({...newFlow, subtitle: e.target.value})} style={{flex:1, padding:"8px"}}/>
                <button type="submit" style={{padding:"8px"}}>Add Step</button>
              </form>
              {data.systems[activeTab].flowSteps.map((f, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
                  <span><strong>{f.stepNum}</strong> - {f.title} ({f.subtitle})</span>
                  <button onClick={() => updateSystem("flowSteps", data.systems[activeTab].flowSteps.filter((_, idx)=>idx!==i))} style={{ color:"red", border: "none", background: "none", cursor: "pointer" }}>X</button>
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
                  <button onClick={() => updateSystem("specs", data.systems[activeTab].specs.filter((_, idx)=>idx!==i))} style={{ color:"red", border: "none", background: "none", cursor: "pointer" }}>X</button>
                </div>
              ))}
            </div>

            <div>
              <h4>Schedule / Interface Register</h4>
              <form onSubmit={(e) => { e.preventDefault(); updateSystem("schedule", [...data.systems[activeTab].schedule, newRow]); setNewRow({tag:"", zone:"", model:"", count:""}); }} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input placeholder="Col 1 (Tag/System)" value={newRow.tag} onChange={(e)=>setNewRow({...newRow, tag: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Col 2 (Zone/Touches)" value={newRow.zone} onChange={(e)=>setNewRow({...newRow, zone: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Col 3 (Model/Status)" value={newRow.model} onChange={(e)=>setNewRow({...newRow, model: e.target.value})} style={{flex:1, padding:"8px"}} required/>
                <input placeholder="Count" value={newRow.count} onChange={(e)=>setNewRow({...newRow, count: e.target.value})} style={{width:"120px", padding:"8px"}}/>
                <button type="submit" style={{padding:"8px"}}>Add Row</button>
              </form>
              {data.systems[activeTab].schedule.map((r, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", background:"#fff", padding:"10px", border:"1px solid #ddd", marginBottom:"5px" }}>
                  <span>{r.tag} | {r.zone} | {r.model}</span>
                  <button onClick={() => updateSystem("schedule", data.systems[activeTab].schedule.filter((_, idx)=>idx!==i))} style={{ color:"red", border: "none", background: "none", cursor: "pointer" }}>X</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}