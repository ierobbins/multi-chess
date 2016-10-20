angular.module("chessApp")
.directive("chessGame", function(){

    return {

        restrict: "E"
        , scope: {
            show: "="
        }
        , replace: true     // replace with the template below
        , transclude: true  // insert custom centent inside the directive
        , link: function(scope, element, attrs){
            scope.dialogStyle = {};
            if(attrs.width)  { scope.dialogStyle.width = attrs.width; }
            if(attrs.height) { scope.dialogStyle.height = attrs.height; }
            sccope.hideModal = function(){
                scope.show = false;
            };
        }
        , templateUrl: "../views/gameOver.html"
    };

});
