const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      await User.findOne({ email }, (err, user) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (!user) {
          console.log("User not found!");
          return done(null, false, { message: "User not found!" });
        }
        if (!bcrypt.compare(password, user.password)) {
          console.log("incorrect password!");
          return done(null, false, { message: "Incorrect password!" });
        }
        return done(null, user);
      });
    } catch (e) {
      console.log(e);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
