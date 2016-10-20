angular.module("chessApp", ["ui.router"])
.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state("login", {
      url: "/"
      , templateUrl: "./views/login.html"
      , controller: "loginCtrl"
    })
    .state("search", {
      url: "/search"
      , templateUrl: "./views/search.html"
      , controller: "searchCtrl"
    })
    .state("profile", {
      url: "/profile/:id"
      , templateUrl: "./views/profile.html"
      , controller: "profileCtrl"
    })
    .state("game", {
      url: "/game/:gameId"
      , templateUrl: "./views/game.html"
      , controller: "gameCtrl"
      , params: {
          user: null
          , side: null
          , time: null
      }
    })
    .state("leaderboards", {
      url: "/leaderboards/:id"
      , templateUrl: "./views/leaderboards.html"
      , controller: "leaderboardsCtrl"
    })
    .state("examine", {
      url: "/examine/:id"
      , templateUrl: "./views/examine.html"
      , controller: "examineCtrl"
    })
    .state("aiGame", {
        url: "/deepPurple/:gameId"
        , templateUrl: "./views/aiGame.html"
        , controller: "aiGameCtrl"
        , params: {
            user: null
            , side: null
        }
    });
});
