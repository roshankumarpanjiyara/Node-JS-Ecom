// database/seedCategory.js
const mongoose = require("mongoose");
const Category = require("../models/Admin/Category");
require("dotenv").config();

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    created_by: "admin",
    meta_title: "Buy Electronics Online",
    meta_description: "Latest gadgets and electronics",
    image: "electronics.png",
    is_active: true,
  },
  {
    name: "Fashion",
    slug: "fashion",
    created_by: "admin",
    meta_title: "Trendy Fashion",
    meta_description: "Latest fashion wear",
    image: "fashion.png",
    is_active: true,
  },
  {
    name: "Home Appliances",
    slug: "home-appliances",
    created_by: "admin",
    meta_title: "Home Essentials",
    meta_description: "Modern home appliances",
    image: "home-appliances.png",
    is_active: true,
  },
  {
    name: "Books",
    slug: "books",
    created_by: "admin",
    meta_title: "Books Online",
    meta_description: "All genres of books",
    image: "books.png",
    is_active: true,
  },
  {
    name: "Sports",
    slug: "sports",
    created_by: "admin",
    meta_title: "Sports Equipment",
    meta_description: "Shop sports gear",
    image: "sports.png",
    is_active: true,
  },
  {
    name: "Toys",
    slug: "toys",
    created_by: "admin",
    meta_title: "Toys Online",
    meta_description: "Toys for kids",
    image: "toys.png",
    is_active: true,
  },
  {
    name: "Furniture",
    slug: "furniture",
    created_by: "admin",
    meta_title: "Furniture Online",
    meta_description: "Stylish furniture",
    image: "furniture.png",
    is_active: true,
  },
  {
    name: "Beauty",
    slug: "beauty",
    created_by: "admin",
    meta_title: "Beauty Products",
    meta_description: "Cosmetics and beauty care",
    image: "beauty.png",
    is_active: true,
  },
  {
    name: "Groceries",
    slug: "groceries",
    created_by: "admin",
    meta_title: "Daily Groceries",
    meta_description: "Fresh groceries",
    image: "groceries.png",
    is_active: true,
  },
  {
    name: "Automobile",
    slug: "automobile",
    created_by: "admin",
    meta_title: "Automobile Accessories",
    meta_description: "Car and bike accessories",
    image: "automobile.png",
    is_active: true,
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ Connected to MongoDB");

    await mongoose.connection.db.collection("categories").deleteMany({});
    console.log("🗑️ Old categories removed");

    await Category.save(categories);
    console.log("✅ Categories inserted successfully");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedCategories();
