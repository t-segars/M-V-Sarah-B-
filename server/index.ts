import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
import * as XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(process.cwd(), 'data.json');
const upload = multer({ dest: "uploads/" });

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // API: Read data
  app.get('/api/data', (req, res) => {
    if (!fs.existsSync(dataFilePath)) {
      return res.json({ openItems: [], systemComponents: [] });
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    res.json(JSON.parse(data));
  });

  // API: Save data
  app.post('/api/data', (req, res) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  });

  // API: Upload and Parse Excel Takeoff (.xlsx)
  app.post("/api/upload-excel", upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const workbook = XLSX.readFile(req.file.path);
      let vesselData: any = {};
      if (fs.existsSync(dataFilePath)) {
        vesselData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
      }

      if (!vesselData.systems) {
        vesselData.systems = { 
          hvac: { description: "", flowSteps: [], specs: [], schedule: [] }, 
          electrical: { description: "", flowSteps: [], specs: [], schedule: [] }, 
          plumbing: { description: "", flowSteps: [], specs: [], schedule: [] }, 
          ancillary: { description: "", flowSteps: [], specs: [], schedule: [] } 
        };
      }

      // Parse PanelTAGs sheet into Electrical Schedule
      if (workbook.Sheets["PanelTAGs"]) {
        const panelRows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets["PanelTAGs"], { range: 1 });
        vesselData.systems.electrical.schedule = panelRows
          .filter((row: any) => row.TAG && row.Location)
          .map((row: any) => ({
            tag: `${row.TAG} · ${row.PANEL || "Main"}`,
            zone: `${row.Location} (Source: ${row.Source || "N/A"})`,
            model: `Voltage: ${row.Voltage || "TBC"} | Breaker: ${row["Amp Breaker"] || "TBC"}`,
            count: ""
          }));
      }

      // Parse NetWorks sheet into Ancillary Schedule
      if (workbook.Sheets["NetWorks"]) {
        const netRows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets["NetWorks"], { range: 1 });
        vesselData.systems.ancillary.schedule = netRows
          .filter((row: any) => row.TAG)
          .map((row: any) => ({
            tag: `${row.Device || "Device"} · ${row.TAG}`,
            zone: `Network: ${row.Network || "N/A"} | Instrument: ${row.Instrument || "Standard"}`,
            model: "TAKEOFF IMPORT",
            count: ""
          }));
      }

      fs.writeFileSync(dataFilePath, JSON.stringify(vesselData, null, 2));
      
      try { fs.unlinkSync(req.file.path); } catch (e) {}

      res.json({ success: true, message: "Excel takeoff successfully parsed and integrated!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to parse Excel file." });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);