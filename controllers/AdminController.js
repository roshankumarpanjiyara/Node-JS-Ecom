const Admin = require('../models/Admin');
const Role = require('../models/Admin/Role');
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

        const authUser = new Admin(null, enteredEmail, null, null, null);
        let existingUser = await authUser.findByEmail();

        console.log("User Found", existingUser);
        console.log("User password", enteredPassword);

        if (!existingUser) {
            console.log("User not found");
            req.flash("alert", { type: "error", message: "Please check your credentials!" });
            return res.redirect('/admin/login');
        }

        // Populate roles manually
        existingUser = await Admin.populateDB(existingUser);
        console.log("User Found", existingUser);

        const hasAdminRole = existingUser.roles.some(role => role.name === "Admin");
        console.log(hasAdminRole);
        if (!hasAdminRole) {
            return res.status(400).render("admin/auth/login", {
                errors: { email: { msg: "Does not allowed here - no admin roles" } },
                old: req.body,
            });
        }

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

        // if (!existingUser.roles.includes("admin")) {
        //     console.log("User does not have base admin role");
        //     req.flash("alert", { type: "error", message: "Access denied!" });
        //     return res.redirect('/admin/login');
        // }


        // Minimal JWT claims
        const payload = { sub: existingUser._id.toString(), email: existingUser.email, roles: existingUser.roles.map(r => r.name), name: existingUser.name, phone: existingUser.phone };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1h' });
        console.log("Admin Token", token);
        console.log("payload", payload);
        // res.cookie('adminToken', token, cookieOpts);
        console.log("Cookies before set:", req.cookies);
        res.cookie('adminToken', token, cookieOpts);
        console.log("Cookies after set header:", res.getHeader('Set-Cookie'));

        req.flash("alert", { type: "success", message: "Login successful!" });
        res.redirect('/admin/dashboard');
    } catch (e) {
        console.log(e);
        res.status(401).render('admin/auth/login', {
            errors: { general: { msg: e.message } },
            old: req.body,
        });
    }
}

async function dashboard(req, res) {
    res.render('admin/page/dashboard');
}


async function getAllAdmin(req, res) {
    let admins = await Admin.getAllAdmins();
    admins = await Admin.populateDB(admins);
    res.render('admin/page/user/view-admins', { admins: admins });
}

async function getAllUsers(req, res) {
    const users = await User.getAllUsers();
    res.render('admin/page/user/view-users', { users: users });
}


module.exports = {
    getAdminLogin: getAdminLogin,
    adminLogin: adminLogin,
    dashboard: dashboard,
    getAllAdmin: getAllAdmin,
    getAllUsers: getAllUsers,
    rules: rules,
}