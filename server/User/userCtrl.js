const User = require("./User");

module.exports = {

    checkLogin(req, res, next){
        if(req.user){
            User.findOne({facebookId: req.user.id}, (err, user) => {
                if(err){
                    return res.status(500).json(err);
                }
                if(user) {
                    return res.status(201).json(user);
                } else {
                    new User({
                        firstName: req.user._json.first_name
                        , lastName: req.user._json.last_name
                        , email: req.user._json.email
                        , facebookId : req.user.id
                        , link : req.user.profileUrl
                        , profilePictureUrl : req.user._json.picture.data.url
                        , fide: 1200
                        , previousGames: []
                    }).save((err, user) => {
                    return (err) ? res.status(500).json(err) : res.status(201).json(user);
                });
                }
            });
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
      User.findOne({facebookId: req.params.id}, (err, user) => {
          return (err) ? res.status(500).json(err) : res.status(201).json(user);
      });
  }

  , addGameToPlayer(req, res){
      User.findByIdAndUpdate(req.params.playerId, {$push: {previousGames: req.params.gameId}}, (err, user) => {
         return (err) ? res.status(500).json(err) : res.status(201).json(user);
      });
  }

}
