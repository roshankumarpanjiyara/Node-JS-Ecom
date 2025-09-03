const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { handleValidation } = require('../middleware/validate');
const { body } = require('express-validator');

const cookieOpts = {
    httpOnly: true,
    sameSite: process.env.SAMESITE || 'strict',
    secure: process.env.COOKIE_SECURE === 'true',
};

// const cookieOpts = {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false,  // must be false on localhost
//     path: "/",
// };


const rules = {
    login: [
        body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
        body('password').isLength({ min: 1 }).withMessage('Password required'),
        handleValidation,
    ],
};

async function getAdminLogin(req, res) {
    res.render('admin/auth/login', { errors: {}, old: {} });
}

async function adminLogin(req, res) {
    try {
        const userData = req.body;
        const enteredEmail = userData.email;
        const enteredPassword = userData.password;

        const authUser = new User(null, enteredEmail, null, null);
        const existingUser = await authUser.findByEmail();
        if (!existingUser) {
            console.log("User not found");
            req.flash("alert", { type: "error", message: "Please check your credentials!" });
            return res.redirect('/admin/login');
        }

        if (existingUser.role !== "admin") {
            res.status(403).send("Not allowed here");
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
            return res.redirect('/admin/login');
        }

        // Minimal JWT claims
        const payload = { sub: existingUser._id.toString(), email: existingUser.email, role: existingUser.role, name: existingUser.name };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1h' });
        console.log("Token", token);
        console.log("payload", payload);
        // res.cookie('adminToken', token, cookieOpts);
        console.log("Cookies before set:", req.cookies);
        res.cookie('token', token, cookieOpts);
        console.log("Cookies after set header:", res.getHeader('Set-Cookie'));

        req.flash("alert", { type: "success", message: "Login successful!" });
        res.redirect('/admin/dashboard');
    } catch (e) {
        res.status(401).render('admin/auth/login', {
            errors: { general: { msg: e.message } },
            old: req.body,
        });
    }
}

async function dashboard(req, res) {
    res.render('admin/page/dashboard');
}


module.exports = {
    getAdminLogin: getAdminLogin,
    adminLogin: adminLogin,
    dashboard: dashboard,
    rules: rules,
}