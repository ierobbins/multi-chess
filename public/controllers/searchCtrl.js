angular.module("chessApp")
.controller("searchCtrl", function($scope, userService, socket){

    userService.getCurrentUser()
        .then(user => {
            $scope.currentUser = user
        });

    $scope.createNewGame = function(){
        user = $scope.currentUser;
        if($scope.color === "white"){
            userService.postNewGame({
                host: $scope.currentUser._id
                , white: $scope.currentUser._id
                , status: "waiting"
                , creationDate: new Date()
                }, user);
        }
        if($scope.color === "black"){
            userService.postNewGame({host: $scope.currentUser._id, black: $scope.currentUser._id}, user);
        }
    }

    socket.on("get games", data => {
        $scope.games = data;
    })

});
