const express = require('express');

const configuredMulterStorage = require('../config/storage-config');
const adminController = require('../controllers/AdminController');
const categoryController = require('../controllers/Admin/CategoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/login', adminController.getAdminLogin);
router.post('/login', adminController.rules.login, adminController.adminLogin);

router.get("/dashboard", authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, adminController.dashboard);

//

//user
// router.get('/users', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, adminController.getAllUsers);
// router.post('/edit-user/:id/:name', authMiddleware.requireAuth, authMiddleware.requireAdmin, adminController.rules.editUser, adminController.updateUser);

//category
router.get('/categories', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, categoryController.getAllCategories);
router.get('/add-category', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, categoryController.getAddCategory);
router.post('/add-category', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, configuredMulterStorage, categoryController.rules.addCategory, categoryController.addCategory);
router.get('/edit-category/:slug/:id', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, categoryController.getEditCategory);
router.post('/edit-category/:slug/:id', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, configuredMulterStorage, categoryController.rules.editCategory, categoryController.editCategory);
router.post('/set-inactive-category/:id', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, categoryController.setInactiveCategory);

module.exports = router;