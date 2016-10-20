angular.module("chessApp")
.controller("aiGameCtrl", function($scope, $stateParams, aiGameService){

    $scope.currentUser  = $stateParams.user;
    $scope.userSide     = $stateParams.side;

    $scope.startGame = function(){
        aiGameService.createBoard($scope.userSide);
        $scope.game = aiGameService.getGame();
        $scope.board = aiGameService.getBoard();
    }

    $scope.startGame();

});
