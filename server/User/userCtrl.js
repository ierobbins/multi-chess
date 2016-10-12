const User = require("./User");

module.exports = {

  function checkLogin(req, res, next){
    if(req.user){
      console.log("user is connected");
      next();
    } else {
      res.redirect("/");
    }
  }

}
