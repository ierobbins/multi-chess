angular.module("chessApp")
.controller("gameCtrl", function($scope, $stateParams, $rootScope, userService, gameService, socket){

    $scope.currentUser  = $stateParams.user;
    $scope.userSide     = $stateParams.side;
    $scope.opponentSide = ($scope.userSide === "white") ? "black" : "white";
    $scope.gameId       = $stateParams.gameId;
    $scope.time         = $stateParams.time;
    $scope.status       = "";

    $scope.showWait = true;

    if($stateParams.user){
        gameService.connectSocket($scope.gameId, $scope.currentUser, $scope.userSide, $scope.time);
    }

    socket.on("wait", () => {
        console.log("FROM SOCKET.ON WAIT IN GAMECTRL");
    });

    socket.on("ready", data => {
        console.log("THIS IS FROM GAMECTRL WHEN A SECOND PERSON LOGS IN", data);
        $scope.showWait = false;
        gameService.startGame(data, $scope.currentUser);
        $scope.board = gameService.getBoard();
        $scope.game = gameService.getGame();
        $scope.opponent = gameService.getOpponent();
        $scope.gameId = gameService.getGameId();
        $scope.isHost = gameService.getHostOrGuest()
        $scope.userTime = new Stopwatch(
            document.querySelector(".userTimer")
            , document.querySelector(".uResults")
            , data.time
        );
        $scope.opponentTime = new Stopwatch(
            document.querySelector(".opponentTimer")
            , document.querySelector(".oResults")
            , data.time
        );
    });

    socket.on("time", data => {
        //TODO
    });

    socket.on("move", data => {
        $scope.game.move({from: data.source, to: data.target});
        $scope.board.position($scope.game.fen());
        $scope.capturedPieces = gameService.findCaptured($scope.game.fen()); //TODO
        $scope.pgn = $scope.game.pgn();
        if($scope.userSide.charAt(0) === $scope.game.turn()){
            $scope.opponentTime.stop();
            $scope.userTime.start();
        } else if($scope.opponentSide.charAt(0) === $scope.game.turn()){
            $scope.userTime.stop();
            $scope.opponentTime.start();
        }
        if($scope.isHost){
            gameService.addMove(data.room, data.move);
        }
    });

    // $scope.onDragStart = function(source , piece, position, orientation){
    //     if($scope.game.game_over() === true ||
    //        $scope.game.turn() === "w" && piece.search(/^b/) !== -1 ||
    //        $scope.game.turn() === "b" && piece.search(/^w/) !== -1 ||
    //        $scope.game.turn() !== $scope.userSide.charAt(0)){
    //            return false;
    //        }
    // }
    //
    // $scope.onSnapEnd = function(){
    //     $scope.board.position($scope.game.fen());
    // }
    //
    // $scope.onDrop = function(source, target, piece, newPos, oldPos, orientation){
    //     let move = $scope.game.move({
    //         from: source
    //         , to: target
    //         , promotion: 'q'
    //     });
    //     console.log("what the fuck is going on!!!!!!!!!!!!!!!!!!!!!!");
    //     if(move === null) { return "snapback"; }
    //     console.log($scope.userSide.charAt(0), game.turn());
    //     console.log($scope.opponentSide.charAt(0), game.turn());
    //     console.log($scope.userSide.charAt(0) === game.turn());
    //     console.log($scope.opponentSide.charAt(0) === game.turn());
    //     if($scope.userSide.charAt(0) === game.turn()){
    //         $scope.opponentTime.stop();
    //         $scope.userTime.start();
    //     } else if($scope.opponentSide.charAt(0) === game.turn()){
    //         $scope.userTime.stop();
    //         $scope.opponentTime.start();
    //     }
    //
    //     let initMove = {};
    //     initMove.pgn = $scope.game.pgn();
    //     initMove.fen = $scope.game.fen();
    //     socket.emit("move", {
    //         room: $scope.gameId
    //         , source: source
    //         , target: target
    //         , piece: piece
    //         , move: initMove
    //         , newPosition: ChessBoard.objToFen(newPos)
    //         , oldPosition: ChessBoard.objToFen(oldPos)
    //     });
    // }

    if($scope.isHost){
        if($scope.userTime.times[0] < 0){
            if($scope.userSide === "white"){
                socket.emit("time", {
                    room: $scope.gameId
                    , win: $scope.opponent
                    , lose: $scope.currentUser
                });
                gameService.gameOver($scope.gameId, "black", "overOnTime");
            } else {
                socket.emit("time", {
                    room: $scope.gameId
                    , win: $scope.opponent
                    , lose: $scope.currentUser
                });
                gameService.gameOver($scope.gameId, "white", "overOnTime");
            }
        }
        if($scope.opponentTime.times[0] < 0){
            if($scope.userSide === "white"){
                socket.emit("time", {
                    room: $scope.gameId
                    , win: $scope.currentUser
                    , lose: $scope.opponent
                });
                gameService.gameOver($scope.gameId, "white", "overOnTime");
            } else {
                socket.emit("time", {
                    room: $scope.gameId
                    , win: $scope.currentUser
                    , lose: $scope.opponent
                });
                gameService.gameOver($scope.gameId, "black", "overOnTime");
            }
        }
    }

});
