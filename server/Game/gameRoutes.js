const gameCtrl = require("./gameCtrl");

module.exports = app => {

  app.post("/api/game", gameCtrl.postGame);

  app.route("/api/game/:id")
    .put(gameCtrl.addWhitePlayer)
    .put(gameCtrl.addBlackPlayer)
    .put(gameCtrl.addMove);

};
