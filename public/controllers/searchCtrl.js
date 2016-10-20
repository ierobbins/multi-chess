angular.module("chessApp")
.controller("searchCtrl", function($scope, userService, socket){

    userService.getCurrentUser()
        .then(user => {
            $scope.currentUser = user
        });

    $scope.createNewGame = function(){
        user = $scope.currentUser;
        if($scope.opponentType && $scope.color && $scope.time){
            if($scope.opponentType === "human"){
                let newTime = parseInt($scope.time);
                console.log("THIS IS NEW TIME \n\n\n\n", newTime, $scope.time);
                if($scope.color === "white"){
                    userService.postNewGame({
                        host: $scope.currentUser._id
                        , white: $scope.currentUser._id
                        , time: newTime
                        , status: "waiting"
                        , creationDate: new Date()
                    }, user);
                }
                if($scope.color === "black"){
                    userService.postNewGame({
                        host: $scope.currentUser._id
                        , black: $scope.currentUser._id
                        , time: newTime
                        , status: "waiting"
                        , creationDate: new Date()
                    }, user);
                }
            } else if ($scope.opponentType === "ai"){
                if($scope.color === "white"){
                    userService.postNewAiGame({
                        host: $scope.currentUser._id
                        , white: $scope.currentUser._id
                        , status: "deepPurple"
                        , creationDate: new Date()
                    }, user);
                }
                if($scope.color === "black"){
                    userService.postNewAiGame({
                        host: $scope.currentUser._id
                        , black: $scope.currentUser._id
                        , status: "deepPurple"
                        , creationDate: new Date()
                    }, user);
                }
            }
        }    
    }

    $scope.joinGame = function(room){
        let side = (room.players[0].side === "white") ? "black" : "white";
        userService.joinGame(room.room, $scope.currentUser, side, room.time);
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
    });

});
