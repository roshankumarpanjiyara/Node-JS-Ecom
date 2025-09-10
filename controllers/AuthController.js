const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { handleValidation } = require('../middleware/validate');
const { body } = require('express-validator');

const cookieOpts = {
    httpOnly: true,
    sameSite: process.env.SAMESITE || 'strict',
    secure: process.env.COOKIE_SECURE === 'true',
};

// const cookieOpts = {
//   httpOnly: true,
//   sameSite: "lax",  // or "strict" in production
//   secure: false,    // true only if using HTTPS
//   path: "/",        // ensure cookie available on all routes
// };


const rules = {
    signup: [
        body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 chars'),
        body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
        body('phone').trim().isLength({ min: 10, max: 10 }).matches(/^[6-9]\d{9}$/).withMessage('Valid phone required'),
        body('password').isStrongPassword({
            minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0,
        }).withMessage('Password must be 8+ chars incl. upper, lower, number'),
        body('confirmPassword')
            .custom((value, { req }) => value === req.body.password)
            .withMessage('Passwords do not match'),
        handleValidation,
    ],
    login: [
        body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
        body('password').isLength({ min: 1 }).withMessage('Password required'),
        handleValidation,
    ],
};

function getSignup(req, res) {
    res.render('customer/auth/signup', { errors: {}, old: {} });
}

async function signUp(req, res) {
    try {
        const authUser = new User(null, req.body.email, null, null);
        const existingUser = await authUser.findByEmail();
        if (existingUser) {
            console.log("User found");
            req.flash("alert", { type: "error", message: "User already exists!" });
            return res.redirect('/login');
        }

        const authPhone = new User(null, null, req.body.phone, null);
        const existingPhone = await authPhone.findByPhone();
        if (existingPhone) {
            console.log("Phone found");
            req.flash("alert", { type: "error", message: "Phone number already exists!" });
            return res.redirect('/signup');
        }

        const user = new User(req.body.name, req.body.email, req.body.phone, req.body.password);
        await user.signUp();

        req.flash("alert", { type: "success", message: "Signup successful!" });
        res.redirect('/login');

        // return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    } catch (e) {
        // Re-render form with error
        res.status(400).render('customer/auth/signup', {
            errors: { general: { msg: e.message } },
            old: req.body,
        });
    }
}

function getLogin(req, res) {
    res.render('customer/auth/login', { errors: {}, old: {} });
}

async function login(req, res) {
    try {
        const userData = req.body;
        const enteredEmail = userData.email;
        const enteredPassword = userData.password;

        const authUser = new User(null, enteredEmail, null, null);
        const existingUser = await authUser.findByEmail();
        if (!existingUser) {
            console.log("User not found");
            req.flash("alert", { type: "error", message: "Please check your credentials!" });
            return res.redirect('/login');
        }

        console.log("User Found", existingUser);
        console.log("User password", enteredPassword);

        const passwordsAreEqual = await bcrypt.compare(
            enteredPassword,
            existingUser.password
        );
        console.log("Password Match", passwordsAreEqual);

        if (!passwordsAreEqual) {
            console.log("Password Error");
            req.flash("alert", { type: "error", message: "Please check your credentials!" });
            return res.redirect('/login');
        }

        // Minimal JWT claims
        const payload = { sub: existingUser._id.toString(), email: existingUser.email, role: existingUser.role, name: existingUser.name };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1hr' });
        console.log("Token", token);
        console.log("payload", payload);
        res.cookie('userToken', token, cookieOpts);
        req.flash("alert", { type: "success", message: "Login successful!" });
        res.redirect('/dashboard');
    } catch (e) {
        res.status(401).render('customer/auth/login', {
            errors: { general: { msg: e.message } },
            old: req.body,
        });
    }
}

async function logout(req, res) {
    // req.session.destroy((err) => {
    //     if (err) console.error(err);

    //     // Clear cookies
    //     res.clearCookie('connect.sid', { path: '/' });
    //     res.clearCookie('_csrf', { path: '/' });
    // });
    res.clearCookie('userToken', { path: '/' });
    req.flash("alert", { type: "success", message: "Logout successful!" });
    res.redirect('/');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signUp: signUp,
    login: login,
    logout: logout,
    rules: rules,

}