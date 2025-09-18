const Permission = require('../../models/Admin/Permission');
const Role = require('../../models/Admin/Role');

const { permissionCache } = require('../../middleware/checkPermission');

async function getPermission(req, res) {
    const roles = await Role.getAllRoles();
    const permissions = await Permission.getAllPermissions();
    // console.log(permissions);
    res.render('admin/page/permission/view-permission', { roles: roles, permissions: permissions, errors: {}, old: {} });
}

async function create(req, res) {
    try {
        const data = req.body;
        const roleId = data.role_id;
        const module = data.module;

        // const moduleNames = Object.keys(module);

        const role = await Role.getRoleById(roleId);

        console.log(data);
        console.log(module);
        // console.log(moduleNames);

        // for (const name of moduleNames) {
        //     const perms = module[name];

        //     const permissions = {
        //         canView: perms["can-view"] ? true : false,
        //         canCreate: perms["can-create"] ? true : false,
        //         canEdit: perms["can-edit"] ? true : false,
        //         canDelete: perms["can-delete"] ? true : false,
        //     }

        //     console.log(permissions);

        //     const existing = await Permission.findByRoleAndModule(roleId, name);

        //     if(existing){
        //         req.flash("alert", { type: "error", message: `Permission for ${role.name} already exists!` });
        //         return res.status(400).redirect('/admin/permissions');
        //     }

        //     const newPermission = new Permission(roleId, name, permissions, null);
        //     newPermission.save();
        // }
        const existing = await Permission.findByRole(roleId);

        if (existing) {
            req.flash("alert", { type: "error", message: `Permission for ${role.name} already exists!` });
            return res.status(400).redirect('/admin/permissions');
        }

        const newPermission = new Permission(roleId, module, null);
        newPermission.save();
        req.flash("alert", { type: "success", message: "Permission created" });
        res.redirect('/admin/permissions');
    } catch (err) {
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/permissions');
    }
}

async function updatePermission(req, res) {
    try {
        const id = req.params.id;
        const roleId = req.params.roleId;

        const data = req.body;
        const module = data.module;

        // console.log(id);
        // console.log(roleId);
        // console.log(data);
        // console.log(module);

        const existing = await Permission.findByRole(roleId);
        const role = await Role.getRoleById(roleId);
        if(role.name === 'Super Admin'){
            req.flash("alert", { type: "warning", message: "Super Admin Permission cannot be updated!" });
            return res.status(400).redirect('/admin/permissions');
        }

        // console.log(role);

        const updatePermission = new Permission(roleId, module, id);
        updatePermission.save();

        // after updating Permission in DB
        permissionCache.flushAll();

        req.flash("alert", { type: "success", message: "Permission updated" });
        res.redirect('/admin/permissions');
    } catch (e) {
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/permissions');
    }
}

async function deletePermission(req, res) {
    try {
        const id = req.params.id;
        const existing = await Permission.findById(id);
        const role = await Role.getRoleById(existing.role);
        // console.log(role);
        if (role.name === 'Super Admin') {
            req.flash("alert", { type: "warning", message: "Super Admin Permission cannot be deleted!" });
            return res.status(400).redirect('/admin/permissions');
        }
        await Permission.delete(id);
        req.flash("alert", { type: "success", message: "User Permission deleted" });
        res.redirect('/admin/permissions');
    } catch (err) {
        console.log(err);
        req.flash("alert", { type: "error", message: err.message });
        res.redirect('/admin/permissions');
    }
}

module.exports = {
    getPermission: getPermission,
    create: create,
    updatePermission: updatePermission,
    deletePermission: deletePermission
}
