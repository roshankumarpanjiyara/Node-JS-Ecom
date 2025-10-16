const Admin = require('../models/Admin');
const Role = require('../models/Admin/Role');
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { handleValidation } = require('../middleware/validate');
const { body } = require('express-validator');
const Permission = require('../models/Admin/Permission');

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

    addAdmin: [
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

    updateAdmin: [
        body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 chars'),
        body('phone').trim().isLength({ min: 10, max: 10 }).matches(/^[6-9]\d{9}$/).withMessage('Valid phone required'),
        body('password').optional({ checkFalsy: true, nullable: true }).isStrongPassword({
            minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0,
        }).withMessage('Password must be 8+ chars incl. upper, lower, number'),
        body('confirmPassword').optional({ checkFalsy: true, nullable: true })
            .custom((value, { req }) => value === req.body.password)
            .withMessage('Passwords do not match'),
        handleValidation,
    ]
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

        // console.log("User Found", existingUser);
        // console.log("User password", enteredPassword);

        if (!existingUser) {
            console.log("User not found");
            req.flash("alert", { type: "error", message: "Please check your credentials!" });
            return res.redirect('/admin/login');
        }

        // Populate roles manually
        existingUser = await Admin.populateDB(existingUser);
        // console.log("User Found", existingUser);

        const hasAdminRole = existingUser.roles.some(role => role.name === "Admin");
        // console.log(hasAdminRole);
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
        // console.log("Password Match", passwordsAreEqual);

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

async function logout(req, res) {
    // req.session.destroy((err) => {
    //     if (err) console.error(err);

    //     // Clear cookies
    //     res.clearCookie('connect.sid', { path: '/' });
    //     res.clearCookie('_csrf', { path: '/' });
    // });
    res.clearCookie('adminToken', { path: '/' });
    req.flash("alert", { type: "success", message: "Logout successful!" });
    res.redirect('/admin/login');
}

async function dashboard(req, res) {
    res.render('admin/page/dashboard');
}


async function getAllAdmin(req, res) {
    // console.log(req.flash("errors")[0]);
    let admins = await Admin.getAllAdmins();
    admins = await Admin.populateDB(admins);
    res.render('admin/page/user/view-admins', { admins: admins, errors: req.flash("errors")[0] || {}, old: req.flash("old")[0] || {} });
}

async function getAllUsers(req, res) {
    const users = await User.getAllUsers();
    res.render('admin/page/user/view-users', { users: users });
}

async function createAdmin(req, res) {
    try {
        const data = req.body;
        const name = data.name;
        const email = data.email;
        const phone = data.phone;
        // console.log(data);
        let admin = new Admin(null, email, null, null, null, null);
        let existingAdmin = await admin.findByEmail();
        // console.log(existingAdmin);
        if (existingAdmin) {
            console.log("Admin found");
            req.flash("alert", { type: "error", message: `Admin already exists with email ${email}!` });
            return res.redirect('/admin/all-admins');
        }

        admin = new Admin(null, null, phone, null, null, null);
        existingAdmin = await admin.findByPhone();
        // console.log(existingAdmin);
        if (existingAdmin) {
            console.log("Admin found with this phone number");
            req.flash("alert", { type: "error", message: `Admin already exists with phone no. ${phone}!` });
            return res.redirect('/admin/all-admins');
        }

        admin = new Admin(name, email, phone, data.password);
        await admin.save();
        req.flash("alert", { type: "success", message: `A New Admin ${name} profile is created!` });
        res.redirect('/admin/all-admins');
    } catch (err) {
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/all-admins');
    }
}

async function updateAdmin(req, res) {
    try {
        const id = req.params.id;
        const email = req.params.email;

        const data = req.body;
        const phone = data.phone;

        // console.log(id);
        // console.log(email);

        let password = '';

        let existingAdmin = await Admin.findByIdAndEmail(id, email);

        const roles = existingAdmin.roles;
        // password = existingAdmin.password;

        // console.log(password);

        // console.log(existingAdmin);
        if(!existingAdmin){
            console.log("Admin not found");
            req.flash("alert", { type: "error", message: `Admin not found!` });
            return res.redirect('/admin/all-admins');
        }

        existingAdmin = await Admin.findOneAdminPhone(phone, id);
        // console.log(existingAdmin);
        if (existingAdmin) {
            console.log("Admin found with this phone number");
            req.flash("alert", { type: "error", message: `Admin already exists with phone no. ${phone}!` });
            return res.redirect('/admin/all-admins');
        }

        if(data.password && data.password.trim() !== ''){
            password = data.password;
        }else{
            password = null;
        }

        // console.log(password);

        // console.log(existingAdmin);
        let updatedAdmin = new Admin(data.name, email, phone, password, roles, id);
        await updatedAdmin.save();

        // console.log(updatedAdmin);
        req.flash("alert", { type: "success", message: `${data.name}'s profile is updated!` });
        res.redirect('/admin/all-admins');
    } catch (err) {
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/all-admins');
    }
}

async function deleteAdmin(req, res){
    try{
        const id = req.params.id;
        await Admin.delete(id);
        req.flash("alert", { type: "success", message: "Admin profile deleted!" });
        res.redirect('/admin/all-admins');
    }catch(err){
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/all-admins');
    }
}


module.exports = {
    getAdminLogin: getAdminLogin,
    adminLogin: adminLogin,
    logout: logout,
    dashboard: dashboard,
    getAllAdmin: getAllAdmin,
    getAllUsers: getAllUsers,
    createAdmin: createAdmin,
    updateAdmin: updateAdmin,
    deleteAdmin: deleteAdmin,
    rules: rules,
}