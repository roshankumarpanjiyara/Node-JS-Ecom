const jwt = require('jsonwebtoken');

// -------- USER AUTH ----------
function requireUserAuth(req, res, next) {
  const token = req.cookies?.userToken;
  if (!token) {
    console.log('No user token found in cookies');
    return res.redirect('/login');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, email, role }
    res.locals.user = payload;
    next();
  } catch (e) {
    console.warn('User JWT verify failed:', e.message);
    res.clearCookie('userToken');
    return res.redirect('/login');
  }
}

// -------- ADMIN AUTH ----------
function requireAdminAuth(req, res, next) {
  const token = req.cookies?.adminToken;
  if (!token) {
    console.log('No admin token found in cookies');
    return res.redirect('/admin/login');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // { sub, email, role }
    res.locals.admin = payload;
    next();
  } catch (e) {
    console.warn('Admin JWT verify failed:', e.message);
    res.clearCookie('adminToken');
    return res.redirect('/admin/login');
  }
}

//---------ATTACH USER---------------
function attachUser(req, res, next) {
  // Try both tokens
  const userToken = req.cookies?.userToken;
  const adminToken = req.cookies?.adminToken;

  let decoded = null;

  try {
    if (userToken) {
      decoded = jwt.verify(userToken, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role || "user", // keep compatibility
      };
    } else if (adminToken) {
      decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
      req.admin = decoded;
      res.locals.admin = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        roles: decoded.roles || [], // array of roles
      };
    } else {
      req.user = null;
      req.admin = null;
      res.locals.user = null;
      res.locals.admin = null;
    }
  } catch (err) {
    console.warn("JWT verify failed in attachUser:", err.message);
    req.user = null;
    req.admin = null;
    res.locals.user = null;
    res.locals.admin = null;
  }

  next();
}


// -------- ROLES CHECKER ----------
function requireRole(role, redirectPath = '/login') {
  return (req, res, next) => {
    const actor = req.user || req.admin;
    if (!actor) return res.redirect(redirectPath);
    // actor.roles is now an array
    if (!actor.roles || !actor.roles.includes(role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
}

// Helpers
const requireUser = requireRole("user", '/login');
const requireAdmin = requireRole("Admin", '/admin/login');

module.exports = {
  requireUserAuth,
  requireAdminAuth,
  requireRole,
  requireUser,
  requireAdmin,
  attachUser
};
