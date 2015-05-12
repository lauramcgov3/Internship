angular.module('MessageAnnotationCtrl', []).controller('MessageAnnotationController', ['$scope', '$sce', '$modalInstance', "$window", "$location", "message", function($scope, $sce, $modalInstance, $window, $location, message) {
    
    $scope.message = message;

    $scope.confirm = function() {
        $modalInstance.close($scope.message);
    }

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
}]);
