const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/User");

const app = express();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    maxAge: 1000
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          console.log("User not found!");
          return done(null, false, { message: "User not found!" });
        }
        const isValidPasswd = await bcrypt.compare(password, user.password);
        if (!isValidPasswd) {
          console.log("incorrect password!");
          return done(null, false, { message: "Incorrect password!" });
        }
        return done(null, user);
      } catch (e) {
        console.log(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const PORT = 5000;
const mongoUri = "mongodb://localhost:27017/crm-test";

async function start() {
  try {
    await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}...`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

start();
