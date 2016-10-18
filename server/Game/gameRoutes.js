const gameCtrl = require("./gameCtrl");

module.exports = app => {

  app.post("/api/game", gameCtrl.postGame);

  app.route("/api/game/addWhite/:id").put(gameCtrl.addWhitePlayer);
  app.route("/api/game/addBlack/:id").put(gameCtrl.addBlackPlayer);
  app.route("/api/game/addMove/:id").put(gameCtrl.addMove);
  app.route("/api/game/gameOver/:id").put(gameCtrl.gameOver);
};
