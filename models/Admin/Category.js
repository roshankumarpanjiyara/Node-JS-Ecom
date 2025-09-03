const mongoose = require("mongoose");

// const ObjectId = mongodb.ObjectId;

// const db = require('../database/database');

// ---------------- Category Schema ----------------
const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        short_name: { type: String, required: true, trim: true },
        created_by: { type: String, required: true },   // you can change to ObjectId if linking to users
        modified_by: { type: String, required: true },
    },
    { timestamps: true } // adds createdAt & updatedAt automatically
);

// ---------------- Mongoose Model ----------------
const CategoryModel = mongoose.model("Category", categorySchema);

class Category {
    constructor(name, short_name, created_by, modified_by, id) {
        this.name = name;
        this.short_name = short_name;
        this.created_by = created_by;
        this.modified_by = modified_by;
        if (id) {
            this.id = id;
        }
    }

    static async fetchAllCategories() {
        // const categories = await db.getDb().collection('categories').find().toArray();
        const categories = await CategoryModel.find().lean();
        return categories;
    }

    async findById() {
        if (!this.id) {
            return;
        }
        // const category = await db.getDb().collection('categories').findOne({ _id: this.id });
        return await CategoryModel.findById(this.id).lean();
        return category;
    }

    async save() {

        const category = new CategoryModel({
            name: this.name,
            short_name: this.short_name,
            created_by: this.created_by,
            modified_by: this.modified_by,
        });

        const savedCategory = await category.save();
        return savedCategory.toObject();
    }
}

module.exports = Category;