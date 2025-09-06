const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // If it’s a form submit, re-render with messages
  const mapped = errors.mapped();
  if (req.path.includes('signup')) {
    return res.status(400).render('customer/auth/signup', { errors: mapped, old: req.body });
  }
  if (req.path.includes('login')) {
    return res.status(400).render('customer/auth/login', { errors: mapped, old: req.body });
  }
  if (req.path.includes('admin/login')) {
    return res.status(400).render('admin/auth/login', { errors: mapped, old: req.body });
  }
  if (req.path.includes('add-category')) {
    return res.status(400).render('admin/page/category/add-category', { errors: mapped, old: req.body });
  }
  // return res.status(400).json({ errors: mapped });
  // fallback: still render generic error page
  return res.status(400).render('error', { errors: mapped });
}

module.exports = { handleValidation: handleValidation };
