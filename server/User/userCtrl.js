const User = require("./User");

module.exports = {

  checkLogin(req, res, next){
    if(req.user){
      next();
    } else {
      res.redirect("/");
    }
  }

  , postUser(req, res){
    new User(req.body).save((err, user) => {
      return (err) ? res.status(500).json(err) : res.status(201).json(user);
    });
  }

  , getUserById(req, res){
    User.find({facebookId: req.params.id}, (err, user) => {
      return (err) ? res.status(500).json(err) : res.status(201).json(user);
    });
  }

}
