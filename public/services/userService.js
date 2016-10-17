angular.module("chessApp")
.service("userService", function($http, $rootScope, socket, $state, $q){

    this.getCurrentUser = function(){
        return $http.get("/api/facebook").then(response => {
            return response.data;
        });
    }

    this.postNewGame = function(obj, user){
        return $http.post("/api/game", obj).then(response => {
            let color = "white";
            if(!response.data.white){color = "black";}
            socket.emit("join", {
                gameId: response.data._id
                , player: response.data.host
                , side: color
            });
            socket.removeAllListeners();
            $state.go("game", {gameId: response.data._id, user: user});
        });
    }

});
