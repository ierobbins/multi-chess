angular.module("chessApp")
.controller("gameCtrl", function($scope, $stateParams, $rootScope, userService, gameService, socket){

    $scope.currentUser = $stateParams.user;
    $scope.showWait = true;

    socket.on("wait", () => {
        console.log("FROM SOCKET.ON WAIT IN GAMECTRL");
    });

    socket.on("ready", data => {
        $scope.showWait = false;
        gameService.startGame(data, $scope.currentUser);
        $scope.board = gameService.getBoard();
        $scope.game = gameService.getGame();
        $scope.getOpponent();
        $scope.gameId = gameService.getGameId();
    });

    socket.on("move", data => {
        $scope.game.move({from: data.source, to: data.target});
        $scope.board.position(game.fen());
    });

    $scope.getOpponent = function(){
        gameService.getOpponent().then(user => {
            $scope.opponent = user.data;
        });
    }

    $scope.onDragStart = function(source , piece, position, orientation){
        if($scope.game.gameOver() === true || $scope.game.turn() === "w" && piece.search(/^b/) !== -1
           $scope.game.turn() === "b" && piece.search(/^w/) !== -1 || $scope.game.turn() !== side.charAt(0)){
               return false;
           }
    }

    $scope.onSnapEnd = function(){
        $scope.board.position($scope.game.fen());
    }

    $scope.onDrop = function(source, target, piece, newPos, oldPos, orientation){
        let move = $scope.game.move({
            from: source
            , to: target
            promotion: 'q'
        });

        if(move === null) { return "snapback"; }

        move.pgn = $scope.game.pgn();
        move.fen = $scope.game.fen();
        socket.emit("move", {
            room: $scope.gameId
            , source: source
            , target: target
            , piece: piece
            , newPosition: ChessBoard.objToFen(newPos)
            , oldPosition: ChessBoard.objToFen(oldPos)
        });
    }


});
