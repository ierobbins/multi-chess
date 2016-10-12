const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./User");
const userCtrl = require("./userCtrl");

module.exports = app => {

  app.get("/auth/facebook", passport.authenticate("facebook", {scope: ["email"]}));

  app.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/#/search"
    , failureRedirect: "/#/login"
  }), (req, res) => {
    console.log(res);
    console.log(req);
  });

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  app.get("/api/facebook", userCtrl.checkLogin, (req, res) => {
    res.send(req.user);
  });



};
