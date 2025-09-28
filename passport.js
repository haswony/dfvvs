const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return done(err);
    if (results.length === 0) return done(null, false, { message: 'Invalid email or password' });
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      return done(null, false, { message: 'Invalid email or password' });
    });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

module.exports = passport;