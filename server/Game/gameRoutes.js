const gameCtrl = require("./gameCtrl");

module.exports = app => {

  app.post("/api/game", gameCtrl.postGame);

};
