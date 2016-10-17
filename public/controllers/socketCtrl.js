angular.module("chessApp")
.controller("socketCtrl", function($scope, socket){

    socket.on("wait", () => {
        console.log("this is the wait from the socket controller");
    })

})
