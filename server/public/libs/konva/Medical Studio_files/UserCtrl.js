angular.module('UserCtrl', []).controller('UserController', ['$scope', 'User', 'Study', '_', '$location', function($scope, User, Study, _, $location) {
    $scope.types = [];
    $scope.userTypes = [];
    $scope.user = {};
    
    getAllTypes();
    
    function getAllTypes() {
        // Get the user's information.
        User.getInformation()
        .success(function(data) {
            $scope.user = data;
            $scope.userTypes = data.relevantTypes;
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });
        
        // Get all the available types, with the user's previous choices.
        setTimeout(function() {
            Study.getAllTypes()
            .success(function(data) {
                data.forEach(function(t) {
                    var relevant = _.findWhere($scope.userTypes, {type: t}).relevant;
                    $scope.types.push({type: t, relevant: relevant});
                });

            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        },100);   
    };
    
    
    $scope.updateUser = function() {
        User.update({
            relevantTypes: $scope.types
        }).success(function(data) {
            $location.path('/');
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });
    };
}]);
