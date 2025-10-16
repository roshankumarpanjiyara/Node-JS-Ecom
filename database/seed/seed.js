const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// ---------------- User Schema ----------------
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// ---------------- Seeder ----------------
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME, // ensures correct DB
    });

    // Hash passwords
    const adminPass = await bcrypt.hash("User@123", 12);
    const userPass = await bcrypt.hash("User@123", 12);

    // Clear old users (optional)
    // await User.deleteMany({});

    // Insert admin and user
    await User.insertMany([
      {
        name: "User1",
        email: "user1@example.com",
        phone: "1234567890",
        password: adminPass,
        role: "user",
      },
      {
        name: "Normal User",
        email: "user@example.com",
        phone: "0987654321",
        password: userPass,
        role: "user",
      },
    ]);

    console.log("✅ User1 and User created successfully!");
    console.log("👉 User1 login: user1@example.com / User@123");
    console.log("👉 User login: user@example.com / User@123");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
