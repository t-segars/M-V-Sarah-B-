import { useEffect, useState } from "react";

export default function DrawingsPage() {
  const [drawings, setDrawings] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.drawings) setDrawings(data.drawings);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px" }}>SYSTEM 06 · DESIGN REGISTER</p>
      <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0" }}>Drawings</h1>
      
      <div style={{ background: "#f0f8ff", border: "1px solid #cce5ff", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#004085" }}>99 PDFs · 33 drawing numbers</h4>
        <p style={{ margin: 0, color: "#004085", fontSize: "0.95rem" }}>All sheets are raster/image-only and follow the file pattern SCC21140NN_Sht_N.pdf.</p>
      </div>

      <div style={{ background: "#fdf8e4", border: "1px solid #f0e6cc", padding: "20px", borderRadius: "8px", marginBottom: "40px" }}>
        <h4 style={{ margin: "0 0 5px 0", color: "#8a6d3b" }}>Revision rule</h4>
        <p style={{ margin: 0, color: "#8a6d3b", fontSize: "0.95rem" }}>Rev C of SCC-21-140-20 is the only current revision. Confirm the rev letter before using a sea chest drawing.</p>
      </div>

      <div style={{ padding: "30px", border: "1px solid #e0e0e0", borderRadius: "16px", background: "#fff" }}>
        <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 10px 0" }}>SCC-21-140 SERIES</p>
        <h3 style={{ fontSize: "1.8rem", margin: "0 0 20px 0" }}>Drawing register</h3>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "15px 0", fontSize: "12px", color: "#888" }}>DRAWING # / DATA</th>
            </tr>
          </thead>
          <tbody>
            {drawings.length === 0 && <tr><td style={{ padding: "20px 0" }}>No drawings uploaded.</td></tr>}
            {drawings.map((doc, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "20px 0", fontWeight: "bold", color: "#222" }}>{doc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}