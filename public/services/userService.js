angular.module("chessApp")
.service("userService", function($http, $rootScope, sockets, $state, $q){
    var user;

  this.getCurrentUser = function(){
    if(!user) {
        return $http.get("/api/facebook").then(response => {
          user = response.data;
          return user;
        });
    } else {
        return $q.when(user);
    }
  }

  this.postNewGame = function(obj){
    return $http.post("/api/game", obj).then(response => {
      return response.data;
      let color = "white";
      if(!response.data.white){color = "black";}
        socket.emit("join", {
          gameId: response.data._id
          , player: response.data.host
          , side: color
        });

      $state.go("game", {gameId: response.data._id});
    });
  }

});
