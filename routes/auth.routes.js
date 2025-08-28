const express = require('express');
const authController =  require('../controllers/AuthController');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);

module.exports = router;