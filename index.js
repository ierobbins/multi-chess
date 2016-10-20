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



const gameCtrl = require("./server/Game/gameCtrl");
const connections = [];
const currentGames = {};

io.on("connection", socket => {
    connections.push(socket);
    console.log(`New connection ${connections.length} socket(s) now connected on ${port}`);
    updateRooms();

    socket.on("error", err => console.log( err, "On error" ) );

    // socket.on("login", data => {
    //     socket.user = data.user._id;
    // });

    socket.on("disconnect", data => {
        connections.splice(connections.indexOf(data), 1);
        console.log(`Disconnected, ${connections.length} socket(s) now connected on ${port}`);

        for(let key in currentGames){  //TODO this does not work because sockets are no longer tied to rooms
            let game = currentGames[key]
            for(let i = 0; i < game.players.length; i++){
                if(game.players[i].socket === socket){
                    socket.broadcast.to(key).emit("opponent-disconnect");
                    delete currentGames[key];
                    updateRooms();
                }
            }
        }
    });


    socket.on("join", data => {
        const room = data.gameId;

        if(!(room in currentGames)){
            let players = [{
                player: data.player
                , side: data.side
                , status: "joined"
                }, {
                player: {}
                , side: data.side === "white" ? "black" : "white"
                , status: "open"
                }
            ];
            currentGames[room] = {
                room: room
                , status: "waiting"
                , time: data.time
                , timeMade: new Date()
                , players: players
            };
            socket.join(room);
            socket.emit("wait");
            updateRooms();
            return;

        }
        const game = currentGames[room];

        if(game.status === "ready"){
             socket.emit("full");
        } else {
            socket.join(room);
            game.players[1].player = data.player;
            game.players[1].status = "joined";
            game.status = "ready";
            io.sockets.to(room).emit("ready", currentGames[room]);
            updateRooms();
        }
    });

    // BROADCASTS NEW MOVE TO THE OTHER PLAYER IN THE GAME
    socket.on("move", data => {
        console.log(data);
        io.sockets.to(data.room).emit("move", data);
    });

    socket.on("resign", data => {
        const room = data.gameId;
        if(room in currentGames){
            io.sockets.to(room).emit("player-resigned", {"side": data.side, "winner": data.winner});
            delete currentGames[room];
            updateRooms();
        }
    });

    socket.on("checkmate", data => {
        console.log(data);
        const room = data.gameId;
        if(room in currentGames){
            io.sockets.to(room).emit("checkmate", {"winner": data.winner});
            delete currentGames[room];
            updateRooms();
        }
    });

    socket.on("time", data => {
        const room = data.gameId;
        if(room in currentGames){
            io.sockets.to(room).emit("time", {"winner": data.winner});
            delete currentGames[room];
            updateRooms();
        }
    });

    socket.on("draw", data => {
        const room = data.gameId;
        if(room in currentGames){
            io.sockets.to(room).emit("draw", {"status": data.status});
            delete currentGames[room];
            updateRooms();
        }
    });

    function findSocket(playerId){
        let userSocket = {};
        for(let i = 0; i < connections.length; i++){
            if(connections[i].user === playerId){
                userSocket = connections[i];
            }
        }
        return userSocket;
    }

    function updateRooms(){
        io.sockets.emit("get games", currentGames);
    }

    function getPlayer(room, side){
        let game = currentGames[room];
        for(let i = 0; i < game.players.length; i++){
            if(players[i].side === side){
                return player[i];
            }
        }
    }
});
