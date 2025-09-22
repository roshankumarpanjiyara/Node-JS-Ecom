const Admin = require('../../models/Admin');
const Role = require('../../models/Admin/Role');

const { handleValidation } = require('../../middleware/validate');
const { body } = require('express-validator');

const rules = {
    addRole: [
        body('name').isLength({ min: 1 }).withMessage('Role name required'),
        body('name').isLength({ min: 1 }).matches(/^[A-Za-z\s]+$/).withMessage('Role name must contain only alphabets'),
        // body('description').optional({ checkFalsy: true, nullable: true }) // allows null or empty
        //     .matches(/^[A-Za-z\s]+$/)
        //     .withMessage("Description must contain only alphabets"),
        handleValidation,
    ],
};

async function getAllRoles(req, res) {
    const roles = await Role.getAllRoles();

    // attach user count to each role
    const rolesWithCounts = await Promise.all(
        roles.map(async (role) => {
            const count = await Admin.countDoc(role);
            return { ...role, userCount: count };
        })
    );

    res.render('admin/page/role/view-roles', { roles: rolesWithCounts, errors: req.flash("errors")[0] || {}, old: req.flash("old")[0] || {} });
}

async function create(req, res) {
    try {
        const data = req.body;
        const roleName = data.name;
        const desc = data.description;

        const existingRole = await Role.getRoleByName(roleName);
        if (existingRole) {
            req.flash("alert", { type: "error", message: "Role already exists!" });
            return res.status(400).redirect('/admin/roles');
        }

        const newRole = new Role(roleName, roleName.toLowerCase(roleName), desc, null);
        await newRole.save();

        req.flash("alert", { type: "success", message: "Role created" });
        res.redirect('/admin/roles');
    } catch (err) {
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/roles');
    }
}

async function editRole(req, res) {
    const roles = await Role.getAllRoles();

    // attach user count to each role
    const rolesWithCounts = await Promise.all(
        roles.map(async (role) => {
            const count = await Admin.countDoc(role);
            return { ...role, userCount: count };
        })
    );
    try {
        // console.log(req.params.slug);
        const id = req.params.id;
        const slug = req.params.slug;

        const data = req.body;
        const name = data.name;
        const description = data.description;

        const existingRole = await Role.findOneRole(name, id);
        // console.log(existingRole);
        if(existingRole){
            req.flash("alert", { type: "error", message: "Role already exists!" });
            return res.status(400).redirect('/admin/roles');
        }

        await Role.update(id, name, name.toLowerCase(name), description);
        req.flash("alert", { type: "success", message: "Role updated" });
        res.redirect('/admin/roles');
    } catch (err) {
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/roles');
    }
}

async function deleteRole(req, res) {
    try{
        const id = req.params.id;
        await Role.delete(id);
        req.flash("alert", { type: "success", message: "Role deleted" });
        res.redirect('/admin/roles');
    }catch(err){
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/roles');
    }
}

module.exports = {
    getAllRoles: getAllRoles,
    create: create,
    editRole: editRole,
    deleteRole: deleteRole,
    rules: rules
}