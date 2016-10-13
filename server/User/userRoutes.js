const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./User");
const userCtrl = require("./userCtrl");

module.exports = app => {

  app.get("/auth/facebook", passport.authenticate("facebook"));
  app.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect : "/#/search",
    failureRedirect : "/"
  }));

  passport.serializeUser(function(user, done){
    done(null, user);
  });

  passport.deserializeUser(function(user, done){
    done(null, user);
  });

  app.get("/api/facebook", userCtrl.checkLogin, (req, res, next) => {
    res.send(req.user);
  });

  app.get("/api/users/facebook/:id", userCtrl.checkLogin, userCtrl.getUserById);

  app.post("/api/users/facebook", userCtrl.checkLogin, userCtrl.postUser);



};
