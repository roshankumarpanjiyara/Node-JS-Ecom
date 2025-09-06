const express = require('express');

const configuredMulterStorage = require('../config/storage-config');
const adminController = require('../controllers/AdminController');
const categoryController = require('../controllers/Admin/CategoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/login', adminController.getAdminLogin);
router.post('/login', adminController.rules.login, adminController.adminLogin);

router.get("/dashboard", authMiddleware.requireAuth, authMiddleware.requireAdmin, adminController.dashboard);

router.get('/categories', authMiddleware.requireAuth, authMiddleware.requireAdmin, categoryController.getAllCategories);
router.get('/add-category', authMiddleware.requireAuth, authMiddleware.requireAdmin, categoryController.getAddCategory);
router.post('/add-category', authMiddleware.requireAuth, authMiddleware.requireAdmin, configuredMulterStorage, categoryController.rules.addCategory, categoryController.addCategory);
router.get('/edit-category/:slug/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, categoryController.getEditCategory);
// router.post('/edit-category/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, categoryController.rules.addCategory, categoryController.editCategory);
// router.post('/delete-category/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, categoryController.deleteCategory);

module.exports = router;