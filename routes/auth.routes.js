const express = require('express');
const authController =  require('../controllers/AuthController');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.post('/signup', authController.rules.signup, authController.signUp);
router.get('/login', authController.getLogin);
router.post('/login', authController.rules.login, authController.login);
router.post('/logout', authController.logout);

module.exports = router;