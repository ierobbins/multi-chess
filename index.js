const express          = require("express");
const bodyParser       = require("body-parser");
const passport         = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session          = require("express-session");
const sessionConfig    = require("./config/sessionConfig");

const mongoose = require("mongoose");
const mongoUri = "mongodb://localhost:27017/multiChess";

mongoose.connect(mongoUri);
mongoose.connection.once("open", () => console.log(`Mongoose listening on ${mongoUri}`));


const app     = express();
const server  = require("http").createServer(app);
const io      = require("socket.io").listen(server);

const port    = process.env.PORT || 8888;


const masterRoutes = require("./server/masterRoutes");
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use(session({
  secret: "keyboard cat"
  , resave: false
  , saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
masterRoutes(app);



//FACEBOOK STRAT
const configAuth = require("./config/facebookAuth");
const User = require("./server/User/User");
passport.use(new FacebookStrategy({
    clientID:       configAuth.facebookAuth.clientID
    , clientSecret: configAuth.facebookAuth.clientSecret
    , callbackURL:  configAuth.facebookAuth.callbackURL
    , profileFields: ["id", "picture", "email", "first_name", "last_name", "link", ]
  }
  , (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
));



server.listen(port, () => console.log(`Express is listening on port ${port}`));




const connections = [];
const users = [];
const games = [];

io.on("connection", socket => {
  connections.push(socket);
  console.log(`New connection ${connections.length} socket(s) now connected on ${port}`);

  socket.on("disconnect", data => {
    connections.splice(connections.indexOf(data), 1);
    console.log(`Disconnected, ${connections.length} socket(s) now connected on ${port}`);
  })


  socket.on("move", msg => {
    console.log(msg);
    socket.broadcast.emit("move", msg)
  });
});
