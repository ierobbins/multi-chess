angular.module("chessApp")
.controller("searchCtrl", function($scope, userService, sockets){

  $scope.getCurrUser = function(){
    userService.getCurrentUser()
      .then(user => {
        $scope.currentUser = user
      });
  }

  $scope.getCurrUser();

  $scope.createNewGame = function(){
    console.log($scope.color);
    if($scope.color === "white"){
      console.log($scope.currentUser);
      userService.postNewGame({host: $scope.currentUser._id, white: $scope.currentUser._id});
    }
    if($scope.color === "black"){
      userService.postNewGame({host: $scope.currentUser._id, black: $scope.currentUser._id});
    }
  }

});
