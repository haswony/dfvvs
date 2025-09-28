const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const passport = require('./passport');
require('dotenv').config();
const db = require('./db');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      return res.redirect('/register');
    }
    res.redirect('/login');
  });
});

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.render('profile', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.post('/profile', upload.single('profilePic'), (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  const { name } = req.body;
  const profilePic = req.file ? '/uploads/' + req.file.filename : req.user.profile_pic;
  db.query('UPDATE users SET name = ?, profile_pic = ? WHERE id = ?', [name, profilePic, req.user.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.redirect('/profile');
    }
    // Update session user
    req.user.name = name;
    req.user.profile_pic = profilePic;
    res.redirect('/profile');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});