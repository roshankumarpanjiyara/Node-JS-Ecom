const express = require('express');
const pageController =  require('../controllers/PageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', pageController.home);
// router.get('/login', (req, res) => res.redirect('/login'));
// router.get('/register', (req, res) => res.redirect('/register'));

router.get('/dashboard', authMiddleware.requireAuth, pageController.dashboard);

module.exports = router;