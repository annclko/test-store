import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Enable CORS for widget embedding
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve HTML at root with embedded JSON data
app.get("/", (req, res) => {
  const htmlPath = path.join(__dirname, "index.html");
  const jsonPath = path.join(__dirname, "data/locationsResults.json");

  // Read both files
  const html = fs.readFileSync(htmlPath, "utf-8");
  const locationsData = fs.readFileSync(jsonPath, "utf-8");

  // Inject JSON data into HTML before the closing script tag
  const htmlWithData = html.replace(
    '<script>',
    `<script>const LOCATIONS_DATA = ${locationsData};`
  );

  res.send(htmlWithData);
});

// Serve JSON data for widget
app.get("/locations", (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "data/locationsResults.json");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(jsonPath);
  } catch (error) {
    console.error('Error serving locations:', error);
    res.status(500).json({ error: 'Failed to load locations' });
  }
});

// Serve static files (CSS, widget.js)
app.use(express.static(__dirname));

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Store Locator running at http://localhost:${PORT}`);
});
