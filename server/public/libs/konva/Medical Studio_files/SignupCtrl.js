angular.module('SignupCtrl', []).controller('SignupController', ['$scope', '$location', '$window', 'User', 'Study', 'Authentication', function($scope, $location, $window, User, Study, Authentication) {
    
    $scope.smAlerts = [];
    $scope.types = [];
    
    // Patterns
    $scope.alphanumeric = /^[a-zA-Z0-9\_\-\.]*$/;    
    
    $scope.rolesList = [
        {name:'Admin', value:'1'},
        {name:'Doctor', value:'2'},
        {name:'Patient', value:'3'}
    ];
    
    
    getAllTypes();
    
    function getAllTypes() {
        Study.getAllTypes()
        .success(function(data) {
            data.forEach(function(t) {
                $scope.types.push({type: t, relevant: false}); 
            });
            
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });
    }
    
    $scope.signUp = function register(form) {
        $scope.smAlerts = [];
        if(form.username.$valid){
            if (Authentication.isAuthenticated) {
                $location.path("/");
            }
            else {
                User.signUp({
                    username: $scope.username,
                    password: $scope.password,
                    passwordConfirmation: $scope.passwordConfirmation,
                    roles: $scope.roles,
                    types: $scope.types
                }).success(function(data) {
                    $location.path("/signin");
                    Authentication.isNew = true;
                }).error(function(status, data) {
                    $scope.smAlerts.push({ 
                        type:'danger', 
                        msg: status, 
                        show: true 
                    });
                });
            }
        }
        else{
            $scope.smAlerts.push({ 
                type:'warning', 
                msg:'Fill out the form correctly', 
                show: true 
            });
        }
    }
}]);
