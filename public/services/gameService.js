angular.module("chessApp")
.service("gameService", function($http, $rootScope, socket, userService){

    let userSide;
    let opponentSide;
    let player;
    let opponent;
    let game;
    let board;
    let gameId;

    this.connectSocket = function(id, user, side, time){
        socket.emit("join", {
            gameId: id
            , player: user
            , side: side
            , time: time
        });
    }

    ////////// GETTERS \\\\\\\\\\
    this.getGame = function(){
        return game;
    }

    this.getBoard = function(){
        return board;
    }

    this.getOpponent = function(){
        return opponent;
    }

    this.getGameId = function(){
        return gameId;
    }

    this.getHostOrGuest = function(){
        return player === "host"
    }

    ////////// STARTS THE GAME WHEN THE CONTROLLER RECIEVES THE READY SIGNAL FROM THE SOCKET \\\\\\\\\\
    this.startGame = function(initGame, user){
        console.log('FROM THE START GAME FUNCTION IN THE GAME SERVICE', initGame.players[0].player._id, user._id);
        player = (initGame.players[0].player._id === user._id) ? "host" : "guest";
        gameId = initGame.room;
        if(player === "host"){
            userSide = initGame.players[0].side;
            opponentSide = initGame.players[1].side;
            opponent = initGame.players[1].player;
        } else {
            userSide = initGame.players[1].side;
            opponentSide = initGame.players[0].side;
            opponent = initGame.players[0].player;
        }

        if(initGame.players[1].side === "white"){
            this.addWhitePlayer(initGame.players[1].player);
        } else {
            this.addBlackPlayer(initGame.players[1].player);
        }

        if(player === "host"){
            this.addGameToPlayer(initGame.players[0].player);
        } else {
            this.addGameToPlayer(initGame.players[1].player);
        }

        this.createBoard(userSide);
    }


    ////////// $HTTP STUFF \\\\\\\\\\
    this.getOpponentById = function(playerId){
        return $http.get("/api/user/fb/:id").then(response => {
            return response.data;
        });
    }

    this.addWhitePlayer = function(playerId){
        return $http.put("/api/game/:id", {playerId: playerId, gameId: gameId, status: "in-progress"})
            .then(response => {
                return response.data;
            });
    }

    this.addBlackPlayer = function(playerId){
        return $http.put("/api/game/:id", {playerId: playerId, gameId: gameId, status: "in-progress"})
            .then(response => {
                return response.data;
            });
    }

    this.addGameToPlayer = function(playerId){
        return $http.put("/api/user/fb/:id", {playerId: playerId, gameId: gameId}).then(response => {
            return response.data;
        });
    }

    this.addMove = function(gameId, move){
        return $http.put("/api/game/:id", {id: gameId, move: move}).then(response => {
            return response.data; //TODO in the backend
        });
    }

    this.gameOver = function(gameId, winColor, endStatus){
        return $http.put("/api/game/:id", {id: gameId, winner: winColor, status: endStatus}).then(response => {
            return response.data; //TODO in the backend
        });
    }


    //////// BOARD VALID MOVE FUNCTIONS \\\\\\\\\\
    this.onDragStart = function(source ,piece, position, orientation){
        if(game.game_over() === true ||
           game.turn() === "w" && piece.search(/^b/) !== -1 ||
           game.turn() === "b" && piece.search(/^w/) !== -1 ||
           game.turn() !== userSide.charAt(0)){
               return false;
           }
    }

    this.onDrop = function(source, target, piece, newPos, oldPos, orientation){

        let move = game.move({
            from: source
            , to: target
            , promotion: 'q'
        });

        if(move === null) { return "snapback"; }

        move.pgn = game.pgn();
        move.fen = game.fen();
        socket.emit("move", {
            room: gameId
            , source: source
            , target: target
            , piece: piece
            , newPosition: ChessBoard.objToFen(newPos)
            , oldPosition: ChessBoard.objToFen(oldPos)
        });
    }

    this.onSnapEnd = function(){
        board.position(game.fen());
    }

    this.createBoard = function(side){
        game = new Chess();
        const cfg = {
            draggable: true
            , position: "start"
            , moveSpeed: "slow"
            , onDragStart: this.onDragStart
            , onSnapEnd: this.onSnapEnd
            , onDrop: this.onDrop
            , snapbackSpeed: 500
            , snapSpeed: 150
            , orientation: userSide
        };
        board = new ChessBoard("gameBoard", cfg);
    }



    // socket.on("ready" data => {
    //
    // });

    // window.onload = () => {
    // //   initGame();
    // // }
    //
    // function initGame(){
    //   const cfg = {
    //     draggable: true
    //     , position: "start"
    //     , onDrop: handleMove
    //   };
    //   board = new ChessBoard("gameBoard", cfg);
    //   game = new Chess();
    // }
    //
    // function handleMove(source, target){
    //   let move = game.move({from: source, to: target});
    //
    //   if(move === null) return "snapback";
    //   else socket.emit("move", move);
    // }
    //
    // socket.on("move", msg => {
    //   game.move(msg);
    //   board.position(game.fen());
    // });

});
