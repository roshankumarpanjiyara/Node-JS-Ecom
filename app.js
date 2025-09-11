require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const csrf = require('csurf');
const session = require("express-session");
const flash = require("connect-flash");
const crypto = require("crypto");
const multer = require("multer");
const dayjs = require("dayjs");

const { connectToDatabase } = require('./database/database');
const { attachUser } = require('./middleware/authMiddleware');
const addCsrfTokenMiddleware = require('./middleware/csrf-token');
const handleErrorMiddleware = require('./middleware/error-handler');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const pageRoutes = require('./routes/page.routes');

const app = express();

// ---------------- Nonce for CSP inline scripts ----------------
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});

// ---------------- Security & Performance ----------------
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": [
          "'self'",
          (req, res) => `'nonce-${res.locals.nonce}'`
        ],
      },
    },
  })
);


app.use(compression());

// ---------------- Session ----------------
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: true,
}));

// ---------------- Flash messages ----------------
app.use(flash());
app.use((req, res, next) => {
  res.locals.alert = req.flash("alert");
  next();
});

// ---------------- View Engine & Body Parser ----------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/categories/assets/', express.static('uploads/categories'));
app.use(
  "/categories/assets/images",
  express.static(path.join(__dirname, "public/uploads/categories/images"))
);
app.use(express.urlencoded({ extended: false }));

// ---------------- Multer for multipart parsing ----------------
// This will parse multipart/form-data WITHOUT storing files
// So CSRF can still read `_csrf` from the body.
const upload = multer();
// app.use(upload.none());

// ---------------- Cookies ----------------
app.use(cookieParser());

// ---------------- Attach User to res.locals ----------------
app.use(attachUser);

// ---------------- CSRF Protection ----------------
app.use(
  csrf({
    cookie: {
      httpOnly: true,          // token cookie not accessible by JS
      sameSite: process.env.SAMESITE || 'strict',
      secure: process.env.COOKIE_SECURE === 'true',
      path: "/",
    },
  })
);
// app.use(csrf());

// ---------------- Custom Middleware ----------------
app.use(addCsrfTokenMiddleware);

// ---------------- Current URL Middleware ----------------
app.use((req, res, next) => {
  res.locals.currentPath = req.path; // available in all EJS templates
  next();
});

// ---------------- Date Library Middleware ----------------
app.use((req, res, next) => {
  res.locals.dayjs = dayjs; // available in all EJS templates
  next();
});

// ---------------- Routes ----------------
app.use('/admin', adminRoutes);  // Admin login + dashboard
app.use(authRoutes);             // User login/signup/logout
app.use(pageRoutes);             // Public pages

// ---------------- Error Handling ----------------
app.use(handleErrorMiddleware);

// ---------------- Start Server ----------------
connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.log('Failed to connect to database:', err);
  });
