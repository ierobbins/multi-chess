const Game = require("./Game");

module.exports = {

    postGame(req, res){
        new Game(req.body).save((err, game) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(game);
        });
    }

    , addWhitePlayer(req, res){
        Game.findOneAndUpdate({_id: req.body.id}, {"white": req.body.playerId, "status": req.body.status}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

    , addBlackPlayer(req, res){
        Game.findOneAndUpdate({_id: req.body.id}, {"black": req.body.playerId, "status": req.body.status}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

    , addMove(req, res){
        Game.findOneAndUpdate({_id: req.body.id}, {$push: {"moves": req.body.move}}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

    , gameOver(req, res){
        Game.findOneAndUpdate({_id: req.body.id}, {"winner": req.body.winner, "status": req.body.status}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

    , drawGame(req, res){
        Game.findOneAndUpdate({_id: req.body.id}, {"winner": "draw", "status": req.body.status}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

};
