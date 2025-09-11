const express = require('express');

const configuredMulterStorage = require('../config/storage-config');
const adminController = require('../controllers/AdminController');
const categoryController = require('../controllers/Admin/CategoryController');
const roleController = require('../controllers/Admin/RoleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/login', adminController.getAdminLogin);
router.post('/login', adminController.rules.login, adminController.adminLogin);

router.get("/dashboard", authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, adminController.dashboard);

//role
router.get('/roles', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, roleController.getAllRoles);
router.post('/store-role', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, roleController.rules.addRole, roleController.create);
router.post('/edit-role/:slug/:id', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, roleController.rules.addRole, roleController.editRole);
router.post('/delete-role/:id', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, roleController.deleteRole);
//user
router.get('/all-admins', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, adminController.getAllAdmin);
router.get('/all-users', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, adminController.getAllUsers);
// router.post('/edit-user/:id/:name', authMiddleware.requireAuth, authMiddleware.requireAdmin, adminController.rules.editUser, adminController.updateUser);

//category
router.get('/categories', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, categoryController.getAllCategories);
router.get('/add-category', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, categoryController.getAddCategory);
router.post('/add-category', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, configuredMulterStorage, categoryController.rules.addCategory, categoryController.addCategory);
router.get('/edit-category/:slug/:id', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, categoryController.getEditCategory);
router.post('/edit-category/:slug/:id', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, configuredMulterStorage, categoryController.rules.editCategory, categoryController.editCategory);
router.post('/set-inactive-category/:id', authMiddleware.requireAdminAuth, authMiddleware.requireAdmin, categoryController.setInactiveCategory);

module.exports = router;