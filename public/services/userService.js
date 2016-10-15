angular.module("chessApp")
.service("userService", function($http, $rootScope, sockets, $state){

  this.getCurrentUser = function(){
    return $http.get("/api/facebook").then(response => {
      return response.data;
    });
  }

  this.postNewGame = function(obj){
    return $http.post("/api/game", obj).then(response => {
      return response.data;
    });
  }

});
