const mongoose = require("mongoose");

const User = new mongoose.Schema({
  facebookId: "String"
  , token: "String"
  , firstName: "String"
  , lastName: "String"
  , email: "String"
  , link: "String"
  , profilePictureUrl: "String"
  , fide:{type: "number", required: true, default: 1200, min: 300, max: 3000}
  , previousGames: [{type: mongoose.Schema.Types.ObjectId, ref: "Game"}]
});

module.exports = mongoose.model("User", User)
