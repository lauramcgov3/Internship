angular.module('StudyCreationMoreInfoCtrl', []).controller('StudyCreationMoreInfoController', ['$scope', '$modalInstance', function($scope, $modalInstance) {

    //CLOSE MANAGEMENT
    $scope.close = function(){
        $modalInstance.close();
    }
    
    //To close the popup on any page change
    $scope.$on('$locationChangeStart', function(event) {
        $scope.close();
    });
    
    window.addEventListener("unload", function(){
        $scope.close();
    });
    //END To close the popup on any page change
    //END CLOSE MANAGEMENT
}]);
