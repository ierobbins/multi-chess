const Game = require("./Game");

module.exports = {

    postGame(req, res){
        console.log(req.body);
        new Game(req.body).save((err, game) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(game);
        });
    }

    , addWhitePlayer(req, res){
        Game.findByIdAndUpdate(req.params.gameId, {white: req.params.playerId, status: req.params.status}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

    , addBlackPlayer(req, res){
        Game.findByIdAndUpdate(req.params.gameId, {black: req.params.playerId, status: req.params.status}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

    , addMove(req, res){
        Game.findByIdAndUpdate(req.params.id, {$push: {move: req.params.move}}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

    , gameOver(req, res){
        Game.findByIdAndUpdate(req.params.id, {$push: {move: req.params.move}}, (err, game) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(game);
        });
    }

};
