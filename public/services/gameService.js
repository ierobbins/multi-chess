angular.module("chessApp")
.service("gameService", function($http, $rootScope, socket, userService){

    let userSide;
    let opponentSide;
    let player;
    let currUser;
    let opponent;
    let game;
    let board;
    let gameId;
    let resigned = false;

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
            currUser = initGame.players[0].player;
        } else {
            userSide = initGame.players[1].side;
            opponentSide = initGame.players[0].side;
            opponent = initGame.players[0].player;
            currUser = initGame.players[1].player;
        }

        if(initGame.players[1].side === "white"){
            this.addWhitePlayer(initGame.players[1].player._id);
        } else {
            this.addBlackPlayer(initGame.players[1].player._id);
        }

        if(player === "host"){
            this.addGameToPlayer(initGame.players[0].player._id);
        } else {
            this.addGameToPlayer(initGame.players[1].player._id);
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
        return $http.put("/api/game/addWhite/:id", {playerId: playerId, id: gameId, status: "in-progress"})
            .then(response => {
                return response.data;
            });
    }

    this.addBlackPlayer = function(playerId){
        return $http.put("/api/game/addBlack/:id", {playerId: playerId, id: gameId, status: "in-progress"})
            .then(response => {
                return response.data;
            });
    }

    this.addGameToPlayer = function(playerId){
        return $http.put("/api/user/fb/:id", {id: playerId, gameId: gameId}).then(response => {
            return response.data;
        });
    }

    this.addMove = function(gameId, move){
        return $http.put("/api/game/addMove/:id", {id: gameId, move: move}).then(response => {
            return response.data;
        });
    }

    this.gameOver = function(gameId, winColor, endStatus){
        return $http.put("/api/game/gameOver/:id", {id: gameId, winner: winColor, status: endStatus}).then(response => {
            return response.data;
        });
    }

    this.drawGame = function(gameId, endStatus){
        if(player === "host"){
            socket.emit("draw", {
                gameId: gameId
                , status: endStatus
            });
        }
        return $http.put("/api/game/drawGame/:id", {id: gameId, status: endStatus}).then(response => {
            return response.data;
        });
    }


    //////// BOARD VALID MOVE FUNCTIONS \\\\\\\\\\
    this.onDragStart = function(source ,piece, position, orientation){
        if(game.game_over() === true ||
           game.turn() === "w" && piece.search(/^b/) !== -1 ||
           game.turn() === "b" && piece.search(/^w/) !== -1 ||
           game.turn() !== userSide.charAt(0) ||
           resigned){
               return false;
           }
    }

    this.onDrop = function(source, target, piece, newPos, oldPos, orientation){
        console.log(game.fen());
        let move = game.move({
            from: source
            , to: target
            , promotion: 'q'
        });
        if(move === null) { return "snapback"; }

        let newMove = {};
        newMove.pgn = game.pgn();
        newMove.fen = game.fen();
        socket.emit("move", {
            room: gameId
            , source: source
            , target: target
            , move: newMove
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

    this.resign = function(side, winColor, gameId){
        resigned = true;
        this.gameOver(gameId, winColor, "resign")
        socket.emit("resign", {
            gameId: gameId
            , side: side
            , winner: winColor
        });
    }

    this.overOnTime = function(gameId, winColor){debugger;
        resigned = true;    //no player resigned, but this has the same effect of turning off the game
        this.gameOver(gameId, winColor, "time");
        if(player === "host"){
            socket.emit("time", {
                gameId: gameId
                , winner: winColor
            });
        }
    }

    this.calculateNewFide = (winColor) => {debugger;

        userFide = currUser.fide;
        opponentFide = opponent.fide;

        let k = 32;
        let r1 = Math.pow(10, (userFide / 400));
        let r2 = Math.pow(10, (opponentFide / 400));

        let e1 = r1 / (r1 + r2);
        let e2 = r2 / (r1 + r2);

        let s1 = 0, s2 = 0;

        if(winColor === "draw"){
            s1 = 0.5; s2 = 0.5;
        } else if (winColor === userSide){
            s1 = 1;
        } else {
            s2 = 1;
        }

        let newUserFide     = r1 + k * (s1 - e1);
        let newOpponentFide = r2 + k * (s2 - e2);

        return $http.put("/api/user/fb/fide/:id", {id: currUser._id, fide: newUserFide}).then(response => {
            return response.data;
        });
    }

    let symbols = 'ppppppppnnbbrrqkPPPPPPPPNNBBRRQK'.split("").sort();
    this.findCaptured = function(fen){

        const symbolKey = {
            "p": "bP", "n": "bN", "b": "bB", "r": "bR", "q": "bQ", "k": "bK",
            "P": "wP", "N": "wN", "B": "wB", "R": "wR", "Q": "wQ", "K": "wK"
        };

        let newFen = [];
        for(let i = 0; i < fen.length; i++){
            if(symbols.indexOf(fen.charAt(i)) !== -1){
                newFen.push(fen.charAt(i));
            }
            if(fen.charAt(i) === " ") { break; }
        }

        newFen = newFen.sort();
        let captured = "";
        if(newFen.length !== symbols.length){
            for(let j = 0; j < newFen.length; j++){
                if(newFen[j] !== symbols[j]){
                    captured = symbols[j];
                    symbols.splice(j, 1);
                }
            }
        }

        if(captured) { return symbolKey[captured]; }
        return null;

    }

    this.appendCaptured = function(captured){

        if(!captured) { return; }

        if(userSide === "white"){
            if(captured.charAt(0) === "b"){
                if(captured.charAt(1) === "P"){
                    $("#captured-pieces-user").prepend(`<div class="cap-piece"><img class="cap-piece-image" src="../img/chesspieces/wikipedia/${captured}.png"></div>`);
                } else {
                    $("#captured-pieces-user").append(`<div class="cap-piece"><img class="cap-piece-image" src="../img/chesspieces/wikipedia/${captured}.png"></div>`);
                }
            } else {
                if(captured.charAt(1) === "P"){
                    $("#captured-pieces-opponent").prepend(`<div class="cap-piece"><img class="cap-piece-image" src="../img/chesspieces/wikipedia/${captured}.png"></div>`);
                } else {
                    $("#captured-pieces-opponent").append(`<div class="cap-piece"><img class="cap-piece-image" src="../img/chesspieces/wikipedia/${captured}.png"></div>`);
                }
            }
        } else {
            if(captured.charAt(0) === "w"){
                if(captured.charAt(1) === "P"){
                    $("#captured-pieces-user").prepend(`<div class="cap-piece"><img src="../img/chesspieces/wikipedia/${captured}.png"></div>`);
                } else {
                    $("#captured-pieces-user").append(`<div class="cap-piece"><img src="../img/chesspieces/wikipedia/${captured}.png"></div>`);
                }
            } else {
                if(captured.charAt(1) === "P"){
                    $("#captured-pieces-opponent").prepend(`<div class="cap-piece"><img src="../img/chesspieces/wikipedia/${captured}.png"></div>`);
                } else {
                    $("#captured-pieces-opponent").append(`<div class="cap-piece"><img src="../img/chesspieces/wikipedia/${captured}.png"></div>`);
                }
            }
        }
    }

});
