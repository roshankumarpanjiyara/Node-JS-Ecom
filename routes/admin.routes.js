const express = require('express');

const adminController = require('../controllers/AdminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/login', adminController.getAdminLogin);
router.post('/login', adminController.rules.login, adminController.adminLogin);
router.get("/dashboard", authMiddleware.requireAuth, authMiddleware.requireRole("admin"), adminController.dashboard);

module.exports = router;