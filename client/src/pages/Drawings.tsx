import { useEffect, useState } from "react";

type DrawingEntry = {
  drawingNum: string;
  title: string;
  sheets: string;
  date: string;
  category: string;
  equipmentTags: string;
  pdfUrl: string;
};

export default function DrawingsPage() {
  const [drawings, setDrawings] = useState<DrawingEntry[]>([]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.drawings && typeof data.drawings[0] !== 'string') {
          setDrawings(data.drawings);
        }
      })
      .catch(console.error);
  }, []);

  const openPdf = (url: string) => {
    if (url) window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <p style={{ color: "#888", fontSize: "12px", letterSpacing: "1px" }}>SYSTEM 06 · DESIGN REGISTER</p>
      <h1 style={{ fontSize: "3rem", margin: "10px 0 20px 0", color: "#0f172a" }}>Drawings</h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "40px" }}>The original SCC Marine design set is the map. The installed vessel is the territory — always confirm revision and field condition.</p>
      
      <div style={{ background: "#f0f8ff", border: "1px solid #dbeafe", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#1e3a8a", fontSize: "1.1rem" }}>99 PDFs · 33 drawing numbers</h4>
        <p style={{ margin: 0, color: "#1e3a8a", fontSize: "0.95rem" }}>
          All sheets are raster/image-only and follow the file pattern <code style={{ background: "#e0f2fe", padding: "2px 6px", borderRadius: "4px" }}>SCC21140NN_Sht_N.pdf</code> . Drawing 029 was searched and confirmed not to exist; Gap G-1 is closed.
        </p>
      </div>

      <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", padding: "20px 24px", borderRadius: "12px", marginBottom: "40px", display: "flex", gap: "15px", alignItems: "center" }}>
        <div style={{ color: "#b45309" }}>📄</div>
        <div>
          <h4 style={{ margin: "0 0 5px 0", color: "#92400e", fontSize: "1rem" }}>Revision rule</h4>
          <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>Rev C of SCC-21-140-20 is the only current revision. It supersedes Rev A and Rev B. Confirm the rev letter before using a sea chest drawing as reference.</p>
        </div>
      </div>

      <div style={{ padding: "30px", border: "1px solid #e2e8f0", borderRadius: "16px", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px", marginBottom: "15px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#9ca3af", textTransform: "uppercase", margin: "0 0 5px 0" }}>SCC-21-140 SERIES</p>
            <h3 style={{ fontSize: "1.8rem", margin: 0, color: "#0f172a" }}>Drawing register</h3>
          </div>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, fontFamily: "monospace" }}>Showing {drawings.length} of 33 numbers</p>
        </div>
        
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "15px", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>DRAWING #</th>
              <th style={{ padding: "15px", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>TITLE</th>
              <th style={{ padding: "15px", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>SHEETS</th>
              <th style={{ padding: "15px", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>DATE</th>
              <th style={{ padding: "15px", fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>CATEGORY</th>
            </tr>
          </thead>
          <tbody>
            {drawings.length === 0 && <tr><td colSpan={5} style={{ padding: "20px" }}>No drawings available.</td></tr>}
            {drawings.map((doc, idx) => (
              <tr 
                key={idx} 
                onClick={() => openPdf(doc.pdfUrl)}
                style={{ borderBottom: "1px solid #f1f5f9", cursor: doc.pdfUrl ? "pointer" : "default" }}
                title={doc.equipmentTags ? `Tags: ${doc.equipmentTags}` : ""}
              >
                <td style={{ padding: "20px 15px", color: "#94a3b8", fontSize: "14px" }}>
                  <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px" }}>{doc.drawingNum}</span>
                </td>
                <td style={{ padding: "20px 15px", color: "#334155", fontSize: "14px" }}>{doc.title}</td>
                <td style={{ padding: "20px 15px", color: "#64748b", fontSize: "14px" }}>{doc.sheets}</td>
                <td style={{ padding: "20px 15px", color: "#64748b", fontSize: "14px" }}>{doc.date}</td>
                <td style={{ padding: "20px 15px", color: "#64748b", fontSize: "14px" }}>{doc.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <p style={{ marginTop: "30px", fontSize: "11px", color: "#9ca3af", fontFamily: "monospace" }}>
          Design intent only · annotate with as-installed changes wherever the design did not materially change.
        </p>
      </div>
    </div>
  );
}