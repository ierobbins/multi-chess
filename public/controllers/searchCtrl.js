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
                , time: $scope.time
                , status: "waiting"
                , creationDate: new Date()
                }, user);
        }
        if($scope.color === "black"){
            userService.postNewGame({
                host: $scope.currentUser._id
                , black: $scope.currentUser._id
                , time: $scope.timeout
                , status: "waiting"
                , creationDate: new Date();
                }, user);
        }
    }

    $scope.joinGame = function(gameId){
        userService.joinGame(gameId, $scope.currentUser);
    }

    socket.on("get games", data => {
        console.log(data);
        $scope.games = [];
        for(let room in data){
            if(data[room].players[0].side === "white"){
                data[room].white = data[room].players[0].player;
                if(data[room].status === "waiting"){
                    data[room].black = "EMPTY"
                } else {
                    data[room].black = data[room].players[1].player;
                }
            } else {
                data[room].black = data[room].players[0].player;
                if(data[room].status === "waiting"){
                    data[room].white = "EMPTY"
                } else {
                    data[room].white = data[room].players[1].player;
                }
            }
            $scope.games.push(data[room]);
        }
    })

});
