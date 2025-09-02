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

const db = require('./database/database');
const addCsrfTokenMiddleware = require('./middleware/csrf-token');
const handleErrorMiddleware = require('./middleware/error-handler');
const { attachUser } = require('./middleware/authMiddleware');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const pageRoutes = require('./routes/page.routes');

const app = express();

// Security & perf
// app.use(helmet());
app.use(compression());

app.use(session({
  secret: "6532c98d9751d835da35bf0f744ffa5103f8868733a3539839f00c788338f323da881bf68dfd27dd560c0ad1c46ea99345b8841577944ecda82211d1fdbb38ba",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Generate nonce for each request (for CSP inline script safety)
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  // res.locals.alert = req.flash("alert");
  next();
});

app.use((req, res, next) => {
  res.locals.alert = req.flash("alert");
  next();
});

// Helmet with CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https:"],          // still safe for JS
    styleSrc: ["'self'", "'unsafe-inline'", "https:"], // allow inline Tailwind classes
    imgSrc: ["'self'", "data:"]
  }
}));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Cookies
app.use(cookieParser());

app.use(attachUser);

// CSRF protection via cookies (double-submit cookie pattern)
app.use(
  csrf({
    cookie: {
      httpOnly: true,          // token cookie not accessible by JS
      sameSite: process.env.SAMESITE || 'strict',
      secure: process.env.COOKIE_SECURE === 'true',
    },
  })
);

app.use(addCsrfTokenMiddleware);

app.use('/admin', adminRoutes);
app.use(pageRoutes);
app.use(authRoutes);

app.use(handleErrorMiddleware);

db.connectToDatabase().then(function () {
  app.listen(3000);
}).catch(function (err) {
  console.log('Failed to connect to the database');
  console.log(err);
});