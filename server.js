import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the HTML file using res.sendFile()
// This route sends the file "map.html" located in "public/html" folder when the root URL is accessed.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "map.html"));
});

// Existing API endpoints and additional routes remain unchanged
// API 1: Fetch Earthquake Alerts
app.get("/api/alerts/", async (req, res) => {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson`
    );
    const data = await response.json();

    const formattedAlerts = data.features.map(eq => ({
      place: eq.properties.place,
      magnitude: eq.properties.mag,
      time: new Date(eq.properties.time).toLocaleString(),
      depth: eq.geometry.coordinates[2],
      coordinates: {
        latitude: eq.geometry.coordinates[1],
        longitude: eq.geometry.coordinates[0]
      }
    }));

    res.json(formattedAlerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch earthquake alerts" });
  }
});

// API 2: Provide Local Disaster Data
const disasterData = [
  { lat: 17.4, lng: 78.4, type: "Flood" },
  { lat: 28.6, lng: 77.2, type: "Earthquake" },
  { lat: 19.076, lng: 72.8777, type: "Cyclone" }
];

app.get("/api/disasters", (req, res) => {
  res.json(disasterData);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
