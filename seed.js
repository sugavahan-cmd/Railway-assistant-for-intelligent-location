const mongoose = require("mongoose");
require("dotenv").config();
const Facility = require("./models/Facility");

async function seedFacilities() {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // clear existing facilities
    await Facility.deleteMany({});

    // insert new facilities
    await Facility.insertMany([
      { name: "Restroom A", type: "restroom", latitude: 13.0827, longitude: 80.2707, accessible: true },
      { name: "Food Court", type: "foodcourt", latitude: 13.0830, longitude: 80.2710 },
      { name: "Main Exit", type: "exit", latitude: 13.0829, longitude: 80.2705, accessible: true }
    ]);

    console.log("✅ Seeded facilities successfully!");
  } catch (err) {
    console.error("❌ MongoDB Seeding Error:", err);
  } finally {
    // close connection cleanly
    await mongoose.disconnect();
  }
}

seedFacilities();
