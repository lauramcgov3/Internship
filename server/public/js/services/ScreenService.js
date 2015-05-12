angular.module('ScreenService', []).factory('Screen', ['$http', function($http) {
    
    return {        
        //TODO
        saveStageImage: function(studyId, stageImage) {
            var fd = new FormData();
            fd.append('file', stageImage);
            return $http.post('/api/screens/saveStageImage/studyId/' + studyId, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    });
        }
    }
}]);