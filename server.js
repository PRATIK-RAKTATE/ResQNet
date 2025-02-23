// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables from .env file



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file when the root URL is accessed (map page remains unchanged)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "map.html"));
});

// New Route: Serve the Donation Page
app.get("/donate", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "donate.html"));
});

// New Route: Serve the Safe Places Page
app.get("/safeplaces", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "safePlaces.html"));
});

// API 1: Fetch Earthquake Alerts (unchanged)
app.get("/api/alerts/", async (req, res) => {
  try {
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson");
    const data = await response.json();

    const formattedAlerts = data.features.map((eq) => ({
      place: eq.properties.place,
      magnitude: eq.properties.mag,
      time: new Date(eq.properties.time).toLocaleString(),
      depth: eq.geometry.coordinates[2],
      coordinates: {
        latitude: eq.geometry.coordinates[1],
        longitude: eq.geometry.coordinates[0],
      },
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
  { lat: 19.076, lng: 72.8777, type: "Cyclone" },
  { lat: 13.0827, lng: 80.2707, type: "Flood" },
  { lat: 22.5726, lng: 88.3639, type: "Tsunami" },
  { lat: 12.9716, lng: 77.5946, type: "Drought" },
  { lat: 25.5941, lng: 85.1376, type: "Landslide" },
];

app.get("/api/disasters", (req, res) => {
  res.json(disasterData);
});

// API 3: Provide Safe Places Data (Updated)
const safePlacesData = [
  { lat: 19.076, lng: 72.8777, name: "Safe Zone Mumbai" },
  { lat: 28.7041, lng: 77.1025, name: "Safe Zone Delhi" },
  { lat: 13.0827, lng: 80.2707, name: "Safe Zone Chennai" },
  { lat: 22.5726, lng: 88.3639, name: "Safe Zone Kolkata" },
  { lat: 12.9716, lng: 77.5946, name: "Safe Zone Bangalore" },
  { lat: 17.3850, lng: 78.4867, name: "Safe Zone Hyderabad" },
  { lat: 18.5204, lng: 73.8567, name: "Safe Zone Pune" }
];

app.get("/api/safeplaces", (req, res) => {
  res.json(safePlacesData);
});

// // Stripe Payment Integration (Dummy Payments)
// app.post("/create-payment", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount || 5000,
//       currency: "usd",
//       payment_method_types: ["card"],
//     });
//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Payment History Endpoint
// app.get("/payment-history", async (req, res) => {
//   try {
//     const paymentHistory = await stripe.paymentIntents.list({ limit: 10 });
//     res.json(paymentHistory.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
