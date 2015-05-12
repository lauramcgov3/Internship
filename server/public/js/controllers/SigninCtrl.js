angular.module('SigninCtrl', []).controller('SigninController', ['$scope', '$location', '$window', 'User', 'Authentication', function($scope, $location, $window, User, Authentication) {
    
    $scope.rememberLabel = 'Stay signed in';
    $scope.alerts = [];
    
    if(Authentication.isNew){
        $scope.alerts.push({ 
            type:'success', 
            msg: 'Account created. You can now login.', 
            show: true
        });
        Authentication.isNew = false;
    }
    
    if(Authentication.isAuthenticated && $window.localStorage.token){
        $location.path("/");
    }
    
    $scope.signIn = function logIn() {
        $scope.alerts = [];
        if ($scope.username !== undefined && $scope.password !== undefined) {
            User.signIn({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme 
            }).success(function(data) {
                Authentication.isAuthenticated = true;
                delete $window.localStorage.token;
                delete $window.localStorage.username;
                $window.localStorage.token = data.token;
                $window.localStorage.username = $scope.username;
                $location.path("/");
            }).error(function(status, data) {
                $scope.password = "";
                if(data == 401){
                    $scope.alerts.push({
                        type:'danger', 
                        msg: 'The username or password you entered is incorrect.', 
                        show: true
                    });
                }
                else{
                    $scope.alerts.push({ 
                        type:'danger', 
                        msg: status, 
                        show: true 
                    });
                }
            });
        }
        else{
            $scope.alerts.push({ 
                type:'danger', 
                msg: 'The username or password is empty.', 
                show: true
            });
        }
    }
}]);
