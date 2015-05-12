angular.module('HeaderCtrl', []).controller('HeaderController', ['$scope', '$location', '$window', 'User', 'Authentication', function($scope, $location, $window, User, Authentication) {
    $scope.prettyUsername  = 'Hi, ' + User.getUsername();
    
    $scope.signOut = function logout() {
        if (Authentication.isAuthenticated) {
            User.signOut().success(function(data) {
                Authentication.isAuthenticated = false;
                delete $window.localStorage.token;
                delete $window.localStorage.username;
                $location.path("/signin");
                $window.location.reload();
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        }
    };
}]);