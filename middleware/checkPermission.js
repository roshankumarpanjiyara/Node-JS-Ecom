// middleware/checkPermission.js
// const Permission = require("../models/Admin/Permission");
// const Role = require("../models/Admin/Role");


// function checkPermission(moduleName, action = "can-view") {
//   return async (req, res, next) => {
//     try {
//       // assuming req.user.role contains the logged-in user's role id
//       const roles = req.admin.roles;
//       const roleIds = [];
//       for (const role of roles) {
//         const rId = await Role.getRoleByName(role);
//         roleIds.push(rId._id);
//       }
//       // console.log(roles);
//       // console.log(roleIds);

//       if (!roleIds || roleIds.length === 0) {
//         return res.status(401).redirect('/401');
//       }

//       // find permission document for this role
//       const permissions = await Permission.findByManyRoles(roleIds);

//       // console.log(permission);

//       // Merge permissions
//       let mergedModules = {};
//       permissions.forEach(p => {
//         if (p.module) {
//           for (const [module, actions] of Object.entries(p.module)) {
//             if (!mergedModules[module]) mergedModules[module] = {};
//             for (const [act, val] of Object.entries(actions)) {
//               if (val === "1") mergedModules[module][act] = "1"; // once allowed, always allowed
//             }
//           }
//         }
//       });

//       if (!permissions || !permissions.length === 0) {
//         return res.status(403).redirect('/403');
//       }

//       console.log(mergedModules);

//       // check if this module exists and has the given action
//       const hasPermission =
//         mergedModules &&
//         mergedModules[moduleName] &&
//         mergedModules[moduleName][action] === "1";

//       // console.log(hasPermission);

//       if (!hasPermission) {
//         return res.status(403).redirect('/403');
//       }

//       req.admin.permissions = mergedModules;

//       next(); // ✅ allow to continue
//     } catch (err) {
//       console.error("Permission check error:", err);
//       return res.status(500).redirect('/500');
//     }
//   };
// }

// module.exports = checkPermission;

const Permission = require('../models/Admin/Permission'); // your Permission model
const Role = require("../models/Admin/Role");
const NodeCache = require('node-cache');

// Cache permissions for 1 minute
const permissionCache = new NodeCache({ stdTTL: 60 });

/**
 * Load permissions for the logged-in user and attach them to req.admin.permissions
 */
async function loadPermissions(req, res, next) {
  if (!req.admin) return next();

  try {
    // const roleIds = req.admin.roles || []; // admin.role is array
    const roles = req.admin.roles;
    const roleIds = [];
    for (const role of roles) {
      const rId = await Role.getRoleByName(role);
      roleIds.push(rId._id);
    }
    // console.log(roles);
    // console.log(roleIds);

    if (!roleIds || roleIds.length === 0) {
      return res.status(401).redirect('/401');
    }

    if (roleIds.length === 0) {
      req.admin.permissions = {};
      return next();
    }

    const cacheKey = roleIds.sort().join('-');

    let permissions = permissionCache.get(cacheKey);

    if (!permissions) {
      // Fetch permissions for all roles
      const records = await Permission.findByManyRoles(roleIds);

      // Merge modules from all roles
      permissions = records.reduce((acc, perm) => {
        Object.entries(perm.module).forEach(([moduleName, actions]) => {
          if (!acc[moduleName]) acc[moduleName] = {};
          Object.entries(actions).forEach(([action, value]) => {
            if (value === '1') acc[moduleName][action] = '1';
          });
        });
        return acc;
      }, {});

      // Save to cache
      permissionCache.set(cacheKey, permissions);
    }
    console.log(permissions);
    req.admin.permissions = permissions;
    next();
  } catch (err) {
    console.error('Permission middleware error:', err);
    req.admin.permissions = {};
    next();
  }
}

/**
 * Check if admin has permission
 * @param {string} module - e.g. 'category'
 * @param {string} action - e.g. 'can-view'
 */
function checkPermission(module, action) {
  return (req, res, next) => {
    const perms = req.admin?.permissions || {};
    if (perms[module] && perms[module][action] === '1') {
      return next();
    }
    return res.status(403).redirect('/403');
  };
}

/**
 * Helper to use in EJS templates
 * Example: <% if (hasPermission(user.permissions, 'category', 'can-view')) { %> ... <% } %>
 */
function hasPermission(permissions, module, action) {
  return permissions?.[module]?.[action] === '1';
}

module.exports = {
  loadPermissions,
  checkPermission,
  hasPermission,
  permissionCache, // expose if you want to clear after update
};
