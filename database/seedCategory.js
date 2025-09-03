const mongoose = require("mongoose");

// --- Your Category Schema ---
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  short_name: { type: String, required: true, unique: true, trim: true },
  created_by: String,
  modified_by: String,
  createdAt: Date,
  updatedAt: Date,
});

const Category = mongoose.model("Category", categorySchema);

// --- Categories Data ---
const categories = [
  {
    name: "Electronics",
    short_name: "electronics",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Fashion",
    short_name: "fashion",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Home & Kitchen",
    short_name: "home_kitchen",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Beauty & Personal Care",
    short_name: "beauty",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sports & Outdoors",
    short_name: "sports",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Books",
    short_name: "books",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Toys & Games",
    short_name: "toys",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Health & Wellness",
    short_name: "health",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Automotive",
    short_name: "automotive",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Groceries",
    short_name: "groceries",
    created_by: "system",
    modified_by: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// --- Seeder Function ---
async function seedCategories() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect("mongodb://0.0.0.0:27017/e-commerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    // Clear old categories
    await Category.deleteMany({});
    console.log("🗑️ Old categories deleted");

    // Insert new categories
    await Category.insertMany(categories);
    console.log("🎉 Categories inserted successfully!");

    // Close connection
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
    process.exit(1);
  }
}

seedCategories();
