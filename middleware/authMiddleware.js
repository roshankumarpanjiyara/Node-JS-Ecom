const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.redirect('/login');

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
  const token = req.cookies.token; // JWT stored in cookie
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to res.locals for EJS templates
    res.locals.user = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    // If token expired or invalid, treat as not logged in
    res.locals.user = null;
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.redirect('/login');
    if (req.user.role !== role) return res.status(403).send('Forbidden');
    next();
  };
}

function requireUser(req, res, next) {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).send("Forbidden: Users only");
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("Forbidden: Admins only");
  }
  next();
}

module.exports = { requireAuth, requireRole, attachUser, requireUser, requireAdmin };
