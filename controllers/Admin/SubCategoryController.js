const Category = require("../../models/Admin/Category");
const SubCategory = require("../../models/Admin/SubCategory");

const { handleValidation } = require('../../middleware/validate');
const { body } = require('express-validator');

const rules = {
    addSubCategory: [
        body('name').isLength({ min: 1 }).withMessage('Sub Category name required'),
        body('name').isLength({ min: 1 }).matches(/^[A-Za-z]+(-[A-Za-z]+)*$/).withMessage('Sub Category name must contain only alphabets and may contain hyphen in between.'),
        handleValidation,
    ],
};

async function getAllSubCategories(req, res) {
    const subCategories = await SubCategory.getAllSubCategories();
    const categories = await Category.fetchAllCategories();
    res.render("admin/page/sub-category/view-sub-category", {
        subCategories: subCategories,
        categories: categories,
        errors: req.flash("errors")[0] || {},
        old: req.flash("old")[0] || {},
    });
}

async function addSubCategory(req, res) {
    try {
        const data = req.body;
        const existingSubCat = await SubCategory.findByName(data.name, data.category);
        if (existingSubCat) {
            const categoryName = await Category.findById(existingSubCat.category);
            req.flash("alert", {
                type: "error",
                message: `${existingSubCat.name} with category ${categoryName.name} is already exists!`,
            });
            return res.status(400).redirect("/admin/sub-categories");
        }

        const newSubCat = new SubCategory(data.name, data.name, req.admin.name, data.category, null);
        await newSubCat.save();

        req.flash("alert", { type: "success", message: "Sub Category created" });
        res.redirect('/admin/sub-categories');
    } catch (err) {
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/sub-categories');
    }
}

async function deleteSubCategory(req, res) {
    try{
        const id = req.params.id;
        await SubCategory.delete(id);
        req.flash("alert", { type: "success", message: "Sub Category deleted" });
        res.redirect('/admin/sub-categories');
    }catch(err){
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/sub-categories');
    }
}

module.exports = {
    getAllSubCategories: getAllSubCategories,
    addSubCategory: addSubCategory,
    deleteSubCategory: deleteSubCategory,
    rules: rules,
};
