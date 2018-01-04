const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const nunjucks = require("nunjucks");
const FB = require("fb");
const users = require("./user.js");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app
});
app.set("views", __dirname + "/views");
app.set("view engine", "njk");

app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    secret: ";iosdfpoihdah[igadf[hoidah[io]]]",
    resave: false,
    saveUninitialized: false
  })
);
// Initialize Passport and restore authentication state,
// if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, callback) {
  console.log(user);
  return callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  return users.findUserById(id).then(user => {
    callback(null, user);
  });
});

passport.use(
  new LocalStrategy(function(email, password, callback) {
    users
      .findUser(email, password)
      .then(user => {
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  })
);

const FACEBOOK_APP_ID = "";
const FACEBOOK_APP_SECRET = "";
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, callback) {
      console.log("facebook", profile);
      FB.api(
        "me",
        { fields: "id,name,email", access_token: accessToken },
        function(user) {
          // Save user in db
          return callback(null, user);
        }
      );
    }
  )
);

app.get("/", function(request, result) {
  result.render("home");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/" }),
  function(request, result) {
    console.log("redirect to /profile");
    result.redirect("/profile");
  }
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    authType: "rerequest",
    scope: ["email"]
  })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);

app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
    result.render("profile", {
      id: request.user.id,
      name: request.user.name,
      email: request.user.email
    });
  }
);

app.get("/logout", function(request, result) {
  request.logout();
  result.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("server running");
});
