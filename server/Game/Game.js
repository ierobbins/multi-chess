const mongoose = require("mongoose");

const Game = new mongoose.Schema({
  host: {type: mongoose.Schema.Type.ObjectId, ref: "User"}
  , white: {type: mongoose.Schema.Type.ObjectId, ref: "User"}
  , black: {type: mongoose.Schema.Type.ObjectId, ref: "User"}
  , moves: [{
      move: {type: "String"}
      , fen: {type: "String"}
  }]
  , time: "String"
  , status: "String"
});

module.exports = mongoose.model("Game", Game);
