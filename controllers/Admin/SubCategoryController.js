const Category = require("../../models/Admin/Category");
const SubCategory = require("../../models/Admin/SubCategory");

async function getAllSubCategories(req, res) {
    const subCategories = await SubCategory.getAllSubCategories();
    const categories = await Category.fetchAllCategories();
    res.render('admin/page/sub-category/view-sub-category', { subCategories: subCategories, categories: categories });
}

async function addSubCategory(req, res) {
    
}

module.exports = {
    getAllSubCategories: getAllSubCategories,
    addSubCategory: addSubCategory
}