import { useState, useEffect } from "react";

// 1. Define the deep data structure required for the complex UI
type SpecCard = { label: string; title: string; description: string };
type ScheduleRow = { tag: string; zone: string; model: string; count: string };

type SystemDetail = {
  description: string;
  specs: SpecCard[];
  schedule: ScheduleRow[];
};

type VesselData = {
  systems: {
    hvac: SystemDetail;
    electrical: SystemDetail;
    plumbing: SystemDetail;
    ancillary: SystemDetail;
  };
};

const defaultSystem: SystemDetail = { description: "", specs: [], schedule: [] };
const defaultData: VesselData = {
  systems: { hvac: defaultSystem, electrical: defaultSystem, plumbing: defaultSystem, ancillary: defaultSystem },
};

type SystemKey = keyof VesselData["systems"];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<VesselData>(defaultData);
  const [activeTab, setActiveTab] = useState<SystemKey>("hvac");

  // Temporary state for new items
  const [newSpec, setNewSpec] = useState<SpecCard>({ label: "", title: "", description: "" });
  const [newRow, setNewRow] = useState<ScheduleRow>({ tag: "", zone: "", model: "", count: "" });

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data")
        .then((res) => res.json())
        .then((fetchedData) => {
          // Initialize with deep structure if migrating from old flat lists
          if (!fetchedData.systems) {
             setData(defaultData);
             saveToBackend(defaultData); 
          } else {
             setData(fetchedData);
          }
        });
    }
  }, [isAuthenticated]);

  const saveToBackend = async (updatedData: VesselData) => {
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    setData(updatedData);
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = { ...data };
    updated.systems[activeTab].description = e.target.value;
    setData(updated); // Update local state while typing
  };

  const addSpec = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...data };
    updated.systems[activeTab].specs.push(newSpec);
    saveToBackend(updated);
    setNewSpec({ label: "", title: "", description: "" });
  };

  const addRow = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...data };
    updated.systems[activeTab].schedule.push(newRow);
    saveToBackend(updated);
    setNewRow({ tag: "", zone: "", model: "", count: "" });
  };

  const removeSpec = (idx: number) => {
    const updated = { ...data };
    updated.systems[activeTab].specs = updated.systems[activeTab].specs.filter((_, i) => i !== idx);
    saveToBackend(updated);
  };

  const removeRow = (idx: number) => {
    const updated = { ...data };
    updated.systems[activeTab].schedule = updated.systems[activeTab].schedule.filter((_, i) => i !== idx);
    saveToBackend(updated);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>McMarine Services LLC</h2>
        <form onSubmit={(e) => { e.preventDefault(); if(password==="mcmarine2026") setIsAuthenticated(true); }}>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" style={{padding:"8px"}}/>
          <button type="submit" style={{padding:"8px"}}>Login</button>
        </form>
      </div>
    );
  }

  const currentSystem = data.systems[activeTab];

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Vessel Content Manager</h1>
      
      {/* System Navigation */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        {(["hvac", "electrical", "plumbing", "ancillary"] as SystemKey[]).map((sys) => (
          <button 
            key={sys} 
            onClick={() => setActiveTab(sys)}
            style={{ padding: "10px 20px", background: activeTab === sys ? "#0056b3" : "#e0e0e0", color: activeTab === sys ? "#fff" : "#333", border: "none", cursor: "pointer" }}
          >
            {sys.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
        <h2>{activeTab.toUpperCase()} System Data</h2>

        {/* Description Textarea */}
        <div style={{ marginBottom: "30px" }}>
          <h4>System Description & Troubleshooting</h4>
          <textarea 
            value={currentSystem.description} 
            onChange={handleDescChange}
            onBlur={() => saveToBackend(data)} // Save on click away
            style={{ width: "100%", height: "80px", padding: "10px", fontFamily: "inherit" }}
            placeholder="Hydronic chilled/heated water system..."
          />
        </div>

        {/* Spec Cards Manager */}
        <div style={{ marginBottom: "40px" }}>
          <h4>Specification Cards (e.g. Chiller Model, Raw-Water Pump)</h4>
          <form onSubmit={addSpec} style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input placeholder="Label (e.g. CHILLER MODEL)" value={newSpec.label} onChange={(e)=>setNewSpec({...newSpec, label: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Title (e.g. Webasto C1080 x 2)" value={newSpec.title} onChange={(e)=>setNewSpec({...newSpec, title: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Description/Source..." value={newSpec.description} onChange={(e)=>setNewSpec({...newSpec, description: e.target.value})} style={{flex:2, padding:"8px"}} required/>
            <button type="submit" style={{padding:"8px 16px"}}>Add Card</button>
          </form>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {currentSystem.specs.map((spec, i) => (
              <div key={i} style={{ background: "#fff", padding: "15px", border: "1px solid #ddd" }}>
                <p style={{ fontSize: "0.8em", color: "#666", margin: "0 0 5px 0" }}>{spec.label}</p>
                <h4 style={{ margin: "0 0 5px 0" }}>{spec.title}</h4>
                <p style={{ fontSize: "0.9em", margin: "0 0 10px 0" }}>{spec.description}</p>
                <button onClick={() => removeSpec(i)} style={{ color: "red" }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Table Manager */}
        <div>
          <h4>Schedule / Zones Table</h4>
          <form onSubmit={addRow} style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input placeholder="Tag (e.g. AH-AD-1)" value={newRow.tag} onChange={(e)=>setNewRow({...newRow, tag: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Zone / Deck" value={newRow.zone} onChange={(e)=>setNewRow({...newRow, zone: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Model" value={newRow.model} onChange={(e)=>setNewRow({...newRow, model: e.target.value})} style={{flex:1, padding:"8px"}} required/>
            <input placeholder="Count" type="number" value={newRow.count} onChange={(e)=>setNewRow({...newRow, count: e.target.value})} style={{width:"80px", padding:"8px"}} required/>
            <button type="submit" style={{padding:"8px 16px"}}>Add Row</button>
          </form>

          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", background: "#fff" }}>
            <thead>
              <tr style={{ background: "#eee" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>TAG</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>ZONE / DECK</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>MODEL</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>COUNT</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSystem.schedule.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{row.tag}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{row.zone}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{row.model}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{row.count}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    <button onClick={() => removeRow(i)} style={{ color: "red" }}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}