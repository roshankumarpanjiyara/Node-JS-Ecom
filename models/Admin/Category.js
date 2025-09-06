const mongoose = require("mongoose");

// const ObjectId = mongodb.ObjectId;

// const db = require('../database/database');

// ---------------- Category Schema ----------------
const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, trim: true },
        created_by: { type: String, required: true, trim: true },
        meta_title: { type: String, trim: true, default: null },
        meta_description: { type: String, trim: true, default: null },
        image: { type: String, required: true, trim: true },
    },
    { timestamps: true } // creates createdAt & updatedAt automatically
);

// ---------------- Mongoose Model ----------------
const CategoryModel = mongoose.model("Category", categorySchema);

class Category {
    constructor(categoryData) {
        this.name = categoryData.name;
        this.slug = categoryData.slug;
        this.created_by = categoryData.created_by;
        this.meta_title = categoryData.meta_title || null;
        this.meta_description = categoryData.meta_description || null;
        this.image = categoryData.image; //name of the image
        this.imagePath = `uploads/categories/images/${categoryData.image}`; //path to access the image
        this.imageUrl = `/categories/assets/images/${categoryData.image}`; //set the static middleware in app.js to access this
        if (categoryData.id) this.id = categoryData.id; // mongoose will handle ObjectId
    }

    static async fetchAllCategories() {
        // const categories = await db.getDb().collection('categories').find().toArray();
        const categories = await CategoryModel.find().lean();
        // console.log(categories);
        return categories;
    }

    static async findById(id) {
        // const category = await db.getDb().collection('categories').findOne({ _id: this.id });
        const category = await CategoryModel.findById(id).lean();
        if(!category) {
            throw new Error("Category not found");
        }
        return category;
        // return category;
    }

    static async findByName(name) {
        const category = await CategoryModel.findOne({ name }).lean();
        if(!category) {
            throw new Error("Category not found");
        }
        return category;
        // return category;
    }

    async save() {

        const category = new CategoryModel({
            name: this.name,
            slug: this.slug,
            created_by: this.created_by,
            meta_title: this.meta_title,
            meta_description: this.meta_description,
            image: this.image,
        });

        const savedCategory = await category.save();
        return savedCategory.toObject();
    }
}

module.exports = Category;