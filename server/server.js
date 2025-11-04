import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());

app.get("/menu", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "data/menu.json"), "utf-8");
  res.json(JSON.parse(data));
});

app.get("/store-locators", (req, res) => {
  // Serve HTML page with external script
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Store Locators</title>
</head>
<body>
  <div id="store-locator-container"></div>

  <!-- External script link -->
  <script src="YOUR_EXTERNAL_SCRIPT_URL_HERE"></script>

  <!-- Optional: Initialize script after it loads -->
  <script>
    // Add initialization code here if needed
    // This will run after the external script loads
  </script>
</body>
</html>
  `;
  res.send(html);
});

app.listen(4000, () => console.log("http://localhost:4000"));
