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
    editCategory: [
        // body("name").isLength({ min: 1 }).withMessage("Category name required"),
        body("image").custom((value, { req }) => {
            if (!req.file && !(req.files && req.files.image)) {
                // ✅ no new file → that’s fine, keep old one
                return true;
            }

            const file = req.file || (req.files && req.files.image);
            const ext = file.originalname.split(".").pop().toLowerCase();
            const allowedExt = ["jpg", "jpeg", "png"];

            if (!allowedExt.includes(ext)) {
                throw new Error("Only JPG, JPEG, and PNG images are allowed");
            }

            return true;
        }),
        body("meta_title")
            .optional({ checkFalsy: true, nullable: true })
            .matches(/^[A-Za-z\s]+$/)
            .withMessage("Meta title must contain only alphabets"),
        body("meta_description")
            .optional({ checkFalsy: true, nullable: true })
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

async function addCategory(req, res, next) {
    try {
        // console.log("Token in body:", req.body._csrf);

        const data = req.body;
        const name = data.name;
        const meta_title = data.meta_title;
        const meta_description = data.meta_description;
        const is_active = data.is_active === 'published' ? true : false;
        const uploadImage = req.file;

        const categoryData = await Category.findByName(name);
        console.log("categoryData:", categoryData);
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
        console.log("is_active:", is_active);
        // console.log("Uploaded file:", uploadImage);

        const category = new Category({ name: name, slug: name.toLowerCase(name), created_by: req.user.name, meta_title: meta_title || null, meta_description: meta_description || null, image: uploadImage.filename, id: null, is_active: is_active });
        await category.save();
        req.flash("alert", { type: "success", message: "Category created" });
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
        res.status(400).render('admin/page/category/add-category', {
            errors: { general: { msg: err.message } },
            old: req.body,
        });
    }
}

async function getEditCategory(req, res) {
    // console.log(req.params.slug);
    // console.log(req.params.id);
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.redirect('/admin/categories');
    }
    // console.log(category);
    res.render('admin/page/category/edit-category', { category: category, errors: {}, old: category });
}

async function editCategory(req, res) {
    const categoryDataId = await Category.findById(req.params.id);
    console.log(categoryDataId);
    try {
        if (!categoryDataId) {
            req.flash("alert", { type: "error", message: "Category not found" });
            return res.redirect('/admin/categories');
        }
        // console.log("Token in body:", req.body._csrf);
        const id = req.params.id;
        const data = req.body;
        // console.log("data:", data);
        const name = data.name;
        const meta_title = data.meta_title;
        const meta_description = data.meta_description;
        is_active = data.is_active === 'published' ? true : false;
        let uploadImage;

        // console.log(categoryDataId);

        const existingCategory = await Category.findOneCategory(name, id);
        // console.log("existingCategory:", existingCategory);
        if (existingCategory) {
            // cleanup file
            if (uploadImage) {
                fs.unlinkSync(path.join(__dirname, "../../public/uploads/categories/images", uploadImage.filename));
            }
            return res.status(400).render("admin/page/category/edit-category", {
                category: categoryDataId,
                errors: { name: { msg: "Category name already exists" } },
                old: req.body,
            });
        }

        if (req.file) {
            uploadImage = req.file;
        }

        // console.log("data:", data);
        // console.log("Uploaded file:", uploadImage);

        const category = await Category.update(id, name.toLowerCase(name), name, meta_title || null, meta_description || null, uploadImage ? uploadImage.filename : categoryDataId.image, is_active);
        // console.log(category);
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "../../public/uploads/categories/images", categoryDataId.image));
        }
        // fs.unlinkSync(path.join(__dirname, "../../public/uploads/categories/images", categoryDataId.image));
        req.flash("alert", { type: "success", message: "Category updated" });
        res.redirect('/admin/categories');
    } catch (err) {
        console.log(err);
        // cleanup file on any error
        if (req.file) {
            fs.unlink(path.join(__dirname, "../../public/uploads/categories/images", req.file.filename), () => { });
        }
        if (err.code === 11000) {
            // Duplicate key error
            return res.status(400).render("admin/page/category/edit-category", {
                category: categoryDataId,
                errors: { name: { msg: "Category name already exists" } },
                old: req.body,
            });
        }
        res.status(400).render('admin/page/category/edit-category', {
            category: categoryDataId,
            errors: { general: { msg: err.message } },
            old: req.body,
        });
    }
}

function setInactiveCategory(req, res){
    res.redirect('/admin/categories');
}

module.exports = {
    getAllCategories: getAllCategories,
    getAddCategory: getAddCategory,
    addCategory: addCategory,
    getEditCategory: getEditCategory,
    editCategory: editCategory,
    setInactiveCategory: setInactiveCategory,
    rules: rules
}