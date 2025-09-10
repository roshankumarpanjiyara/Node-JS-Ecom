// seeds/adminSeed.js
const mongoose = require("mongoose");
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin"); // Adjust path if needed
const Role = require("../../models/Admin/Role");   // Adjust path if needed

const seedAdmin = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");

    // 2. Find "Super Admin" role
    const superAdminRole = await Role.getRoleByName("Super Admin");
    if (!superAdminRole) {
      console.error("❌ Super Admin role not found. Please seed roles first.");
      process.exit(1);
    }

    const adminRole = await Role.getRoleByName("Admin");
    if (!adminRole) {
      console.error("❌ Admin role not found. Please seed roles first.");
      process.exit(1);
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash("password123", 12);

    // 4. Insert admin
    // const admin = await Admin.create({
    //   name: "Main Admin",
    //   email: "admin@example.com",
    //   password: hashedPassword,
    //   phone: "1234567890",
    //   roles: [superAdminRole._id, adminRole._id], // Reference to Role
    // });
    await mongoose.connection.db.collection("admins").insertOne({
      name: "RK",
      email: "admin@example.com",
      password: hashedPassword, // bcrypt hash for "password123"
      phone: "1234567890",
      roles: [new ObjectId(superAdminRole._id),new ObjectId(adminRole._id)],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("✅ Admin seeded:");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
