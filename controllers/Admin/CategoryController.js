const fs = require("fs");
const path = require("path");

const Category = require('../../models/Admin/Category');

const { handleValidation } = require('../../middleware/validate');
const { body } = require('express-validator');

const rules = {
    addCategory: [
        body('image').custom((value, { req }) => {
            if (!req.file && !(req.files && req.files.image)) {
                throw new Error("Image file missing");
            }

            const file = req.file || (req.files && req.files.image);

            const allowedExt = ["jpg", "jpeg", "png"];
            const ext = file.originalname.split(".").pop().toLowerCase();

            if (!allowedExt.includes(ext)) {
                throw new Error("Only JPG, JPEG, and PNG images are allowed");
            }

            return true;
        }),
        body('name').isLength({ min: 1 }).withMessage('Category name required'),
        body('meta_title').optional({ checkFalsy: true, nullable: true }) // allows null or empty
            .matches(/^[A-Za-z\s]+$/)
            .withMessage("Meta title must contain only alphabets"),
        body('meta_description').optional({ checkFalsy: true, nullable: true }) // allows null or empty
            .matches(/^[A-Za-z\s]+$/)
            .withMessage("Meta description must contain only alphabets"),
        handleValidation,
    ],
};

async function getAllCategories(req, res) {
    const categories = await Category.fetchAllCategories();
    res.render('admin/page/category/view-category', { categories: categories });
}

function getAddCategory(req, res) {
    res.render('admin/page/category/add-category', { errors: {}, old: {} });
}

function addCategory(req, res, next) {
    try {
        // console.log("Token in body:", req.body._csrf);

        const data = req.body;
        const name = data.name;
        const meta_title = data.meta_title;
        const meta_description = data.meta_description;
        const uploadImage = req.file;

        const categoryData = Category.findByName(name);
        if (categoryData) {
            // cleanup file
            if (uploadImage) {
                fs.unlinkSync(path.join(__dirname, "../../public/uploads/categories/images", uploadImage.filename));
            }
            return res.status(400).render("admin/page/category/add-category", {
                errors: { name: { msg: "Category name already exists" } },
                old: req.body,
            });
        }

        console.log("data:", data);
        console.log("Uploaded file:", uploadImage);

        const category = new Category({ name: name, slug: name.toLowerCase(name), created_by: req.user.name, meta_title: meta_title || null, meta_description: meta_description || null, image: uploadImage.filename, id: null });
        category.save();
        res.redirect('/admin/categories');
    } catch (err) {
        // cleanup file on any error
        if (req.file) {
            fs.unlink(path.join(__dirname, "../../public/uploads/categories/images", req.file.filename), () => { });
        }
        if (err.code === 11000) {
            // Duplicate key error
            return res.status(400).render("admin/page/category/add-category", {
                errors: { name: { msg: "Category name already exists" } },
                old: req.body,
            });
        }
        res.status(401).render('admin/page/category/add-category', {
            errors: { general: { msg: e.message } },
            old: req.body,
        });
    }
}

function getEditCategory(req, res) {
    console.log(req.params.slug);
    console.log(req.params.id);
    res.render('admin/page/category/edit-category', { errors: {}, old: {} });
}

module.exports = {
    getAllCategories: getAllCategories,
    getAddCategory: getAddCategory,
    addCategory: addCategory,
    getEditCategory: getEditCategory,
    rules: rules
}