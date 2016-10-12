const mongoose = require("mongoose");

const User = new mongoose.Schema({
  facebook: {
    id: "String"
    , token: "String"
    , first_name: "String"
    , last_name: "String"
    , email: "String"
    , link: "String"
    , cover: "String"
  }
  , fide:{type: "number", required: true, default: 1200, min: 300, max: 3000}
  , previousGames: [{type: mongoose.Schema.Types.ObjectId, ref: "Game"}]
});

module.exports = mongoose.model("User", User)
