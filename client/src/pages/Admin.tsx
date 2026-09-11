import { useState, useEffect } from "react";

type VesselData = {
  openItems: string[];
  drawings: string[];
  crewReference: string[];
  systemComponents: {
    electrical: string[];
    hvac: string[];
    plumbing: string[];
    ancillary: string[];
  };
};

const defaultData: VesselData = {
  openItems: [],
  drawings: [],
  crewReference: [],
  systemComponents: { electrical: [], hvac: [], plumbing: [], ancillary: [] },
};

// Sub-component for managing individual lists cleanly
function ListManager({
  title,
  placeholder,
  items,
  onAdd,
  onRemove,
}: {
  title: string;
  placeholder: string;
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (idx: number) => void;
}) {
  const [val, setVal] = useState("");
  return (
    <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
      <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{title}</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (val.trim()) {
            onAdd(val.trim());
            setVal("");
          }
        }}
        style={{ display: "flex", gap: "5px", marginBottom: "10px" }}
      >
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button type="submit" style={{ padding: "8px 12px", background: "#0056b3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Add
        </button>
      </form>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.length === 0 && <li style={{ color: "#888", fontSize: "0.9em" }}>No items listed.</li>}
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "8px", border: "1px solid #ddd", marginBottom: "5px", borderRadius: "4px" }}>
            <span>{item}</span>
            <button onClick={() => onRemove(i)} style={{ color: "#d9534f", border: "none", background: "none", cursor: "pointer", fontWeight: "bold" }}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VesselData>(defaultData);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data")
        .then((res) => res.json())
        .then((fetchedData) => {
          // Graceful fallback merging in case older JSON structure is loaded
          setData({
            openItems: fetchedData.openItems || [],
            drawings: fetchedData.drawings || [],
            crewReference: fetchedData.crewReference || [],
            systemComponents: {
              electrical: fetchedData.systemComponents?.electrical || [],
              hvac: fetchedData.systemComponents?.hvac || [],
              plumbing: fetchedData.systemComponents?.plumbing || [],
              ancillary: fetchedData.systemComponents?.ancillary || [],
            },
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load data", err);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "mcmarine2026") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const saveToBackend = async (updatedData: VesselData) => {
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      setData(updatedData);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const addTop = (key: "openItems" | "drawings" | "crewReference", val: string) => {
    saveToBackend({ ...data, [key]: [...data[key], val] });
  };

  const removeTop = (key: "openItems" | "drawings" | "crewReference", idx: number) => {
    saveToBackend({ ...data, [key]: data[key].filter((_, i) => i !== idx) });
  };

  const addSys = (key: keyof VesselData["systemComponents"], val: string) => {
    saveToBackend({ ...data, systemComponents: { ...data.systemComponents, [key]: [...data.systemComponents[key], val] } });
  };

  const removeSys = (key: keyof VesselData["systemComponents"], idx: number) => {
    saveToBackend({ ...data, systemComponents: { ...data.systemComponents, [key]: data.systemComponents[key].filter((_, i) => i !== idx) } });
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>McMarine Services LLC</h2>
        <p>Vessel Systems Management Gateway</p>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="password" placeholder="Enter Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px" }} />
          <button type="submit" style={{ padding: "10px", cursor: "pointer", background: "#0056b3", color: "white", border: "none" }}>Access Dashboard</button>
        </form>
      </div>
    );
  }

  if (loading) return <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>Loading vessel data...</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px", marginBottom: "20px" }}>M/V Sarah B — Content Management</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        
        {/* Vessel Systems Panel */}
        <div>
          <h2 style={{ color: "#444" }}>Vessel Systems</h2>
          <ListManager 
            title="Electrical" placeholder="Power plant updates..." items={data.systemComponents.electrical} 
            onAdd={(val) => addSys("electrical", val)} onRemove={(idx) => removeSys("electrical", idx)} 
          />
          <ListManager 
            title="HVAC" placeholder="Comfort system updates..." items={data.systemComponents.hvac} 
            onAdd={(val) => addSys("hvac", val)} onRemove={(idx) => removeSys("hvac", idx)} 
          />
          <ListManager 
            title="Plumbing" placeholder="Water & waste updates..." items={data.systemComponents.plumbing} 
            onAdd={(val) => addSys("plumbing", val)} onRemove={(idx) => removeSys("plumbing", idx)} 
          />
          <ListManager 
            title="Ancillary" placeholder="Cross-system updates..." items={data.systemComponents.ancillary} 
            onAdd={(val) => addSys("ancillary", val)} onRemove={(idx) => removeSys("ancillary", idx)} 
          />
        </div>

        {/* Documentation & Tasks Panel */}
        <div>
          <h2 style={{ color: "#444" }}>Documentation & Tasks</h2>
          <ListManager 
            title="Drawings" placeholder="Design register links or titles..." items={data.drawings} 
            onAdd={(val) => addTop("drawings", val)} onRemove={(idx) => removeTop("drawings", idx)} 
          />
          <ListManager 
            title="Open Items" placeholder="Needs attention..." items={data.openItems} 
            onAdd={(val) => addTop("openItems", val)} onRemove={(idx) => removeTop("openItems", idx)} 
          />
          <ListManager 
            title="Crew Reference" placeholder="Running procedures..." items={data.crewReference} 
            onAdd={(val) => addTop("crewReference", val)} onRemove={(idx) => removeTop("crewReference", idx)} 
          />
        </div>

      </div>
    </div>
  );
}