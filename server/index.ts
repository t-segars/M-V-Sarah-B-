import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(process.cwd(), 'data.json');

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Crucial: allows Express to read JSON bodies in POST requests
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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all other routes (must be last!)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);