const express = require('express');
const pageController = require('../controllers/PageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', pageController.home);
// router.get('/login', (req, res) => res.redirect('/login'));
// router.get('/register', (req, res) => res.redirect('/register'));
router.get('/403', pageController.get403);
router.get('/401', pageController.get401);
router.get('/500', pageController.get500);
router.get('/404', pageController.get404);

router.get('/dashboard', authMiddleware.requireUserAuth, pageController.dashboard);

module.exports = router;