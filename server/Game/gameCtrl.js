const Game = require("./Game");

module.exports = {

  postGame(req, res){
    console.log(req.body);
    new Game(req.body).save((err, game) => {
      return (err) ? res.status(500).json(err) : res.status(201).json(game);
    });
  }

};
