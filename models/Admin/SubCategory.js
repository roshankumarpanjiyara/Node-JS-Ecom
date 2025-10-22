const mongoose = require("mongoose");

// ---------------- Category Schema ----------------
const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    created_by: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true } // creates createdAt & updatedAt automatically
);

// ---------------- Mongoose Model ----------------
const SubCategoryModel = mongoose.model("Sub-Category", subCategorySchema);

class SubCategory{
    constructor(name, slug, created_by, category, id){
        this.name = name;
        this.slug = slug;
        this.created_by = created_by;
        this.category = category;
        if(id){
            this.id = id;
        }
    }

    static async getAllSubCategories(){
        return await SubCategoryModel.find().populate('category').sort({createdAt: -1});
    }

    static async findByName(name, category){
      return await SubCategoryModel.findOne({name: name, category: category}).lean();
    }

    async save(){
      const subCat = new SubCategoryModel({
        name: this.name,
        slug: this.name.toLowerCase().replace(/ /g, "-"),
        created_by: this.created_by,
        category: this.category
      });

      const savedSubCat = await subCat.save();
      return savedSubCat.toObject();
    }

    static async delete(id){
        await SubCategoryModel.findByIdAndDelete(id);
    }
}

module.exports = SubCategory;
