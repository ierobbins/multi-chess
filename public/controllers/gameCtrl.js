angular.module("chessApp")
.controller("gameCtrl", function($scope, userService, gameService, sockets){

    userService.getCurrentUser()
        .then(user => {
            $scope.currentUser = user;
        });

});
