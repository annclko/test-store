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

app.listen(4000, () => console.log("http://localhost:4000"));
