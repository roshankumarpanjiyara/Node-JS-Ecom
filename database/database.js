const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    // Connect to MongoDB with Mongoose
    await mongoose.connect(uri, {
      dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error("❌ Could not connect to MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = {
  connectToDatabase,
};
