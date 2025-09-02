const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function seed() {
    const uri = process.env.MONGO_URI; // e.g. "mongodb://127.0.0.1:27017/ecommerce"
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME); // default DB from your URI
        const users = db.collection("users");

        // Hash passwords
        const adminPass = await bcrypt.hash("Admin@123", 12);
        const userPass = await bcrypt.hash("User@123", 12);

        // Clear old users (optional)
        // await users.deleteMany({});

        // Insert admin and user
        await users.insertMany([
            {
                name: "Super Admin",
                email: "admin@example.com",
                phone: "1234567890",
                password: adminPass,
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Normal User",
                email: "user@example.com",
                phone: "0987654321",
                password: userPass,
                role: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        console.log("✅ Admin and User created successfully!");
        console.log("👉 Admin login: admin@example.com / Admin@123");
        console.log("👉 User login: user@example.com / User@123");
    } catch (err) {
        console.error("❌ Error seeding database:", err);
    } finally {
        await client.close();
    }
}

seed();
