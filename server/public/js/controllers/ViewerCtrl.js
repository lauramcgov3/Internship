angular.module('ViewerCtrl', []).controller('ViewerController', ['$scope', '$routeParams', 'Image', 'Tool', 'ZoomAndPan', '$window', function($scope, $routeParams, Image, Tool, ZoomAndPan, $window) {

	// Charge les images dans un tableau afin d'envoyer les informations aux différentes directives.
	$scope.images = [];
    $scope.nbScreens;
    $scope.studyId = $routeParams.id;
    $scope.tool = Tool.getTool();
    $scope.view = 'all';

    $scope.dataHasLoaded = false;
    
    $scope.loadImages = function() {
		Image.getByStudy($scope.studyId)
    	.success(function(data) {
            $scope.images['CCR'] = _.findWhere(data, {laterality: "R", position: "CC"});
            $scope.images['CCL'] = _.findWhere(data, {laterality: "L", position: "CC"});
            $scope.images['MLOR'] = _.findWhere(data, {laterality: "R", position: "MLO"});
            $scope.images['MLOL'] = _.findWhere(data, {laterality: "L", position: "MLO"});
            $scope.nbScreens = data.length;
            $scope.dataHasLoaded = true;
    	});
	}

	// Les boutons d'outils dans la vue auront un ng-click qui appelera cette fonction.
	$scope.changeTool = function(category, element) {
		Tool.setTool(category, element);
	}
    
    $scope.setView = function(view) {;
        $scope.view = view;   
        var nbScreens;
        if (view == 'all' || view == 'ws') {
            nbScreens = $scope.nbScreens;
        } else if (view == 'cc' || view == 'mlo') {
            nbScreens = 2;
        } else {
            nbScreens = 1;  
        }
        ZoomAndPan.execChangeScreen(view, nbScreens);
    }
    
    $scope.loadImages();
    
    $scope.resetZoom = function() {
        ZoomAndPan.execResetFunctions();
    }
    
     //On resize
    angular.element($window).bind('resize', function() {
         ZoomAndPan.resize();
    });
    
}]);

