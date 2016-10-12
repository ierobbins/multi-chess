const userRoutes = require("./User/userRoutes")
    , gameRoutes = require("./Game/gameRoutes");

module.exports = app => {
  userRoutes(app);
  gameRoutes(app);
}
