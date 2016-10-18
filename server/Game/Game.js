const mongoose = require("mongoose");

const Game = new mongoose.Schema({
  host: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  , white: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  , black: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  , winner: {type: "String", enum: ["white", "black", "draw"]}
  , moves: [{
      move: {type: "String"}
      , fen: {type: "String"}
  }]
  , time: "String"
  , creationDate: "String"
  , status: "String"
});

module.exports = mongoose.model("Game", Game);
