const mongoose = require("mongoose");
const Role = require("../../models/Admin/Role"); // adjust path as needed
require("dotenv").config();

async function seedRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    const roles = [
      {
        name: "Admin",
        slug: "admin",
        description: "Basic admin role with limited access to backend functions",
      },
      {
        name: "Super Admin",
        slug: "super-admin",
        description: "Full access to all system features and settings",
      },
      {
        name: "Editor",
        slug: "editor",
        description: "Can manage and edit content but not system-level settings",
      },
      {
        name: "Administrator",
        slug: "administrator",
        description: "Responsible for managing users and higher-level system tasks",
      },
    ];

    for (const role of roles) {
      const exists = await Role.getRoleByName(role.name);
      if (!exists) {
        const savedRole = new Role(role.name, role.slug, role.description);
        await savedRole.save();
        console.log(`✅ Role "${role.name}" created`);
      } else {
        console.log(`⚠️ Role "${role.name}" already exists`);
      }
    }

    console.log("🎉 Seeding completed");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding roles:", err);
    mongoose.disconnect();
  }
}

seedRoles();
