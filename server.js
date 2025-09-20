const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection (replace with your MongoDB URI if needed)
mongoose.connect("mongodb://127.0.0.1:27017/shopApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product Schema
const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  description: String,
  image: String,
});

// Shop location (fixed example: Chennai)
const shopLocation = { lat: 13.0827, lng: 80.2707 };

// Function to calculate distance in KM
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Get products if user within 10km
app.post("/products", async (req, res) => {
  const { lat, lng } = req.body;
  const distance = getDistance(lat, lng, shopLocation.lat, shopLocation.lng);

  if (distance <= 10) {
    const products = await Product.find();
    res.json(products);
  } else {
    res.status(403).json({ message: "You are outside the shop's 10km radius." });
  }
});

// AI Chatbot Route
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY", // Replace with your key
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: message }],
    }),
  });
  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
