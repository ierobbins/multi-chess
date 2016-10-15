angular.module("chessApp")
.service("gameService", function($scope, $http, $rootScope, $stateParams, sockets, userService){

    socket.on("wait", () => {
        //do some kind of modal waiting thing
    })

    socket.on("ready" data => {
        if()

    });

    socket.on("ready", data => {

    });

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

})
