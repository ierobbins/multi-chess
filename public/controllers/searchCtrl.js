angular.module("chessApp")
.controller("searchCtrl", function($scope, userService, $timeout){

  $scope.currentUser = {};

  $scope.getCurrUser = function(){
    userService.getCurrentUser()
      .then(user => {
        $scope.currentUser = {
          firstName: user._json.first_name
          , lastName: user._json.last_name
          , email: user._json.email
          , facebookId: user.id
          , link: user.profileUrl
          , profilePictureUrl: user._json.picture.data.url
        }
      });
  }

  $scope.getCurrUser();

  

  const socket = io("http://localhost:8888", {query: "user=" + currentUser.facebookId})

});
