const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not set in environment variables");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

module.exports = connectDB;
