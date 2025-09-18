const express = require('express');

const configuredMulterStorage = require('../config/storage-config');
const adminController = require('../controllers/AdminController');
const categoryController = require('../controllers/Admin/CategoryController');
const roleController = require('../controllers/Admin/RoleController');
const permissionController = require('../controllers/Admin/PermissionController');

const authMiddleware = require('../middleware/authMiddleware');
const {loadPermissions, checkPermission} = require('../middleware/checkPermission');

const router = express.Router();


router.get('/login', adminController.getAdminLogin);
router.post('/login', adminController.rules.login, adminController.adminLogin);
router.get('/logout', adminController.logout);

router.use(authMiddleware.requireAdminAuth);
router.use(authMiddleware.requireAdmin);
router.use(loadPermissions);

router.get("/dashboard", adminController.dashboard);

//role
router.get('/roles', roleController.getAllRoles);
router.post('/store-role', roleController.rules.addRole, roleController.create);
router.post('/edit-role/:slug/:id', roleController.rules.addRole, roleController.editRole);
router.post('/delete-role/:id', roleController.deleteRole);

//permission
router.get('/permissions', permissionController.getPermission);
router.post('/create-permission', permissionController.create);
router.post('/update-permission/:id/:roleId', permissionController.updatePermission);
router.post('/delete-permission/:id', permissionController.deletePermission);

//user
router.get('/all-admins', adminController.getAllAdmin);
router.get('/all-users', adminController.getAllUsers);
router.post('/create-admin', adminController.rules.addAdmin, adminController.createAdmin);
router.post('/update-admin/:id/:email', adminController.rules.updateAdmin, adminController.updateAdmin);
// router.post('/edit-user/:id/:name', authMiddleware.requireAuth, authMiddleware.requireAdmin, adminController.rules.editUser, adminController.updateUser);

//category
router.get('/categories',checkPermission("category", "can-view"), categoryController.getAllCategories);
router.get('/add-category',checkPermission("category", "can-view"), categoryController.getAddCategory);
router.post('/add-category',checkPermission("category", "can-view"), configuredMulterStorage, categoryController.rules.addCategory, categoryController.addCategory);
router.get('/edit-category/:slug/:id',checkPermission("category", "can-view"), categoryController.getEditCategory);
router.post('/edit-category/:slug/:id',checkPermission("category", "can-view"), configuredMulterStorage, categoryController.rules.editCategory, categoryController.editCategory);
router.post('/set-inactive-category/:id',checkPermission("category", "can-view"), categoryController.setInactiveCategory);

module.exports = router;