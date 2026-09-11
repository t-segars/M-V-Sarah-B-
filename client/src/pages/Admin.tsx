import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ openItems: string[]; systemComponents: string[] }>({
    openItems: [],
    systemComponents: [],
  });
  const [newItem, setNewItem] = useState("");
  const [newComponent, setNewComponent] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data")
        .then((res) => res.json())
        .then((fetchedData) => {
          setData(fetchedData);
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

  const saveToBackend = async (updatedData: typeof data) => {
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

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    saveToBackend({ ...data, openItems: [...data.openItems, newItem] });
    setNewItem("");
  };

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComponent.trim()) return;
    saveToBackend({ ...data, systemComponents: [...data.systemComponents, newComponent] });
    setNewComponent("");
  };

  const removeItem = (index: number, listType: "openItems" | "systemComponents") => {
    const updatedList = data[listType].filter((_, i) => i !== index);
    saveToBackend({ ...data, [listType]: updatedList });
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <h2>McMarine Services LLC</h2>
        <p>Vessel Systems Management Gateway</p>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px" }}
          />
          <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>Access Dashboard</button>
        </form>
      </div>
    );
  }

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading vessel data...</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px" }}>Vessel Maintenance Panel</h1>
      
      <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
        {/* Open Items Column */}
        <div style={{ flex: 1 }}>
          <h3>Open Items (Repairs/Tasks)</h3>
          <form onSubmit={handleAddItem} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input 
              type="text" 
              value={newItem} 
              onChange={(e) => setNewItem(e.target.value)} 
              placeholder="e.g. Inspect starboard bilge pump" 
              style={{ flex: 1, padding: "8px" }}
            />
            <button type="submit" style={{ padding: "8px" }}>Add</button>
          </form>
          <ul style={{ paddingLeft: "20px" }}>
            {data.openItems.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                {item} <button onClick={() => removeItem(idx, "openItems")} style={{ marginLeft: "10px", color: "red" }}>X</button>
              </li>
            ))}
          </ul>
        </div>

        {/* System Components Column */}
        <div style={{ flex: 1 }}>
          <h3>System Components</h3>
          <form onSubmit={handleAddComponent} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input 
              type="text" 
              value={newComponent} 
              onChange={(e) => setNewComponent(e.target.value)} 
              placeholder="e.g. Raymarine Axiom Pro" 
              style={{ flex: 1, padding: "8px" }}
            />
            <button type="submit" style={{ padding: "8px" }}>Add</button>
          </form>
          <ul style={{ paddingLeft: "20px" }}>
            {data.systemComponents.map((comp, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                {comp} <button onClick={() => removeItem(idx, "systemComponents")} style={{ marginLeft: "10px", color: "red" }}>X</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}