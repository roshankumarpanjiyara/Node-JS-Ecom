const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  // if (!token) return res.redirect('/login');
  if(!token) {
    console.log('No token found in cookies');
    return res.redirect('/login');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, email, role, iat, exp }
    res.locals.user = payload; // use in EJS (navbar, etc.)
    next();
  } catch (e) {
    console.warn('JWT verify failed:', e.message);
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

function attachUser(req, res, next) {
  const token = req.cookies?.token; // JWT stored in cookie
  if (!token) {
    req.user = null;
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Attach user info to res.locals for EJS templates
    res.locals.user = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    // If token expired or invalid, treat as not logged in
    req.user = null;
    res.locals.user = null;
  }
  next();
}

function requireRole(role, redirectPath = '/login') {
  return (req, res, next) => {
    if (!req.user) return res.redirect(redirectPath);
    if (req.user.role !== role) return res.status(403).send('Forbidden');
    next();
  };
}

// Helpers
const requireUser = requireRole("user", '/login');
const requireAdmin = requireRole("admin", '/admin/login');

module.exports = { requireAuth, requireRole, attachUser, requireUser, requireAdmin };
