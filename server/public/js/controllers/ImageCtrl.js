angular.module('ImageCtrl', []).controller('ImageController', ['$scope', 'Image', function($scope, Image) {
    $scope.images = [];
    $scope.patients = [];
    
    $scope.canDraw = true;
        
//    getImages();
//    
//    function getImages() {
//        Image.list()
//        .success(function(data) {
//            $scope.images = data;
//        }).error(function(status, data) {
//            console.log(status);
//            console.log(data);
//        });
//    };
    

}]);
