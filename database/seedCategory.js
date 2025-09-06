const mongoose = require("mongoose");
const Category = require("../models/Admin/Category"); // your class

require("dotenv").config();

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ Connected to MongoDB");

    // Optional: Clear old categories
    // await mongoose.connection.db.collection("categories").deleteMany({});

    const categoriesData = [
      { name: "Electronics", slug: "electronics", created_by: "admin", meta_title: "Electronics", meta_description: "All electronic items", image: "electronics.jpg" },
      { name: "Clothing", slug: "clothing", created_by: "admin", meta_title: "Clothing", meta_description: "Men & Women clothing", image: "clothing.jpg" },
      { name: "Books", slug: "books", created_by: "admin", meta_title: "Books", meta_description: "All kinds of books", image: "books.jpg" },
      { name: "Sports", slug: "sports", created_by: "admin", meta_title: "Sports", meta_description: "Sporting goods", image: "sports.jpg" },
      { name: "Home & Kitchen", slug: "home-kitchen", created_by: "admin", meta_title: "Home & Kitchen", meta_description: "Home appliances", image: "home_kitchen.jpg" },
      { name: "Toys", slug: "toys", created_by: "admin", meta_title: "Toys", meta_description: "Kids toys", image: "toys.jpg" },
      { name: "Beauty", slug: "beauty", created_by: "admin", meta_title: "Beauty", meta_description: "Beauty products", image: "beauty.jpg" },
      { name: "Automotive", slug: "automotive", created_by: "admin", meta_title: "Automotive", meta_description: "Car & bike accessories", image: "automotive.jpg" },
      { name: "Health", slug: "health", created_by: "admin", meta_title: "Health", meta_description: "Health products", image: "health.jpg" },
      { name: "Grocery", slug: "grocery", created_by: "admin", meta_title: "Grocery", meta_description: "Daily groceries", image: "grocery.jpg" },
    ];

    for (let data of categoriesData) {
      const category = new Category(
        data.name,
        data.slug,
        data.created_by,
        data.meta_title,
        data.meta_description,
        data.image
      );
      await category.save();
    }

    console.log("✅ 10 Categories seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();
