angular.module("chessApp")
.controller("gameCtrl", function($scope, $stateParams, $rootScope, userService, gameService, socket){

    $scope.currentUser  = $stateParams.user;
    $scope.userSide     = $stateParams.side;
    $scope.opponentSide = ($scope.userSide === "white") ? "black" : "white";
    $scope.gameId       = $stateParams.gameId;
    $scope.time         = $stateParams.time;

    $scope.showGameOver = false;
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
            , $scope.overOnTime
        );
        $scope.opponentTime = new Stopwatch(
            document.querySelector(".opponentTimer")
            , document.querySelector(".oResults")
            , data.time
            , $scope.overOnTime
        );
    });

    socket.on("time", data => {
        $scope.message = `${data.winner} wins on time`;
        console.log("TIME CALLED", data);
        $("#game-over-modal").addClass("show");
        $scope.newFide(data.winner);
    });

    socket.on("resign", data => {
        $scope.message = `${data.loser} resigns, ${data.winner} wins`;
        console.log("RESIGN CALLED", data);
        $("#game-over-modal").addClass("show");
        $scope.newFide(data.winner);
    });

    socket.on("checkmate", data => {debugger;
        $scope.message = `${data.winner} wins by checkmate`;
        console.log("CHECKMATE CALLED", data);
        $("#game-over-modal").addClass("show");
        $scope.newFide(data.winner);
    });

    socket.on("draw", data => {
        $scope.message = `Draw by ${data.status}`;
        console.log("DRAW CALLED", data);
        $("#game-over-modal").addClass("show");
        $scope.newFide("draw");
    });

    $scope.newFide = winColor => {debugger;
        gameService.calculateNewFide(winColor);
    }

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
        $scope.checkGameOver();
        if($scope.isHost){
            gameService.addMove(data.room, data.move);
        }
    });

    $scope.resign = function(){
        $scope.userTime.stop();
        $scope.opponentTime.stop();
        gameService.resign($scope.userSide, $scope.opponentSide, $scope.gameId, $scope.currentUser, $scope.opponent);
    }

    $scope.overOnTime = function(){
        $scope.userTime.stop();
        $scope.opponentTime.stop();
        let win = ($scope.userTime.times[0] < 0) ? $scope.opponentSide : $scope.userSide;
        gameService.overOnTime($scope.gameId, win, $scope.currentUser, $scope.opponent);
    }

    $scope.checkGameOver = function(){
        if($scope.game.in_checkmate() || $scope.game.in_stalemate() || $scope.game.insufficient_material()){
            $scope.userTime.stop();
            $scope.opponentTime.stop();
            if($scope.game.in_checkmate()){
                let win = ($scope.game.turn() === "w") ? "black" : "white";
                gameService.gameOver($scope.gameId, win, "checkmate", $scope.currentUser, $scope.opponent);
                if($scope.isHost){
                    socket.emit("checkmate", {
                        gameId: $scope.gameId
                        , winner: win
                    });
                }
            }
            if($scope.game.in_stalemate()){
                gameService.drawGame($scope.gameId, "stalemate", $scope.currentUser, $scope.opponent);
            }
            if($scope.game.insufficient_material()){
                gameService.drawGame($scope.gameId, "insufficient material", $scope.currentUser, $scope.opponent);
            }
        }
    }
});
