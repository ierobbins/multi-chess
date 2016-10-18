angular.module("chessApp")
.service("userService", function($http, $rootScope, socket, $state, $q){

    this.getCurrentUser = function(){
        return $http.get("/api/facebook").then(response => {
            return response.data;
        });
    }

    this.getUser = function(playerId){
        return $http.get("/api/user/fb").then(response => {
            return response.data;
        });
    }

    this.postNewGame = function(obj, user){
        return $http.post("/api/game", obj).then(response => {
            let color = "white";
            if(!response.data.white){color = "black";}
            console.log(response.data);
            $state.go("game", {
                gameId: response.data._id
                , user: user
                , side: color
                , time: response.data.time
            });
        });
    }

    this.joinGame = function(id, user, side, time){
        $state.go("game", {
            gameId: id
            , user: user
            , side: side
            , time: time
        });
    }

});
