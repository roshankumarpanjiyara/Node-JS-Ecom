const Permission = require('../../models/Admin/Permission');
const Role = require('../../models/Admin/Role');

async function getPermission(req, res){
    const roles = await Role.getAllRoles();
    res.render('admin/page/permission/view-permission', { roles: roles, errors: {}, old: {} });
}

async function create(req, res) {
    try{
    }catch(err){

    }
}

module.exports = {
    getPermission: getPermission
}
