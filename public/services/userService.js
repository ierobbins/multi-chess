angular.module("chessApp")
.service("userService", function($http, $rootScope){

  this.getCurrentUser = function(){
    return $http.get("/api/facebook").then(response => {
      let results = response.data;
      $http.get(`/api/users/facebook/${results.id}`).then(userResponse => {
        if(userResponse.data.length > 0){
          currentUser = userResponse.data[0];
          return currentUser;
        } else {
          currentUser = {
            firstName: results._json.first_name
            , lastName: results._json.last_name
            , email: results._json.email
            , facebookId : results.id
            , link : results.profileUrl
            , profilePictureUrl : results._json.picture.data.url
            , fide: 1200
            , previousGames: []
          }
          this.postCurrentUser(currentUser);
        }
      });
      return response.data;
    });
  }

  this.postCurrentUser = (user) => {
    return $http.post("/api/users/facebook", user).then(response => {
      currentUser = response.data;
      return response;
    });
  }
});
