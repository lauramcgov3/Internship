angular.module('ImageService', []).factory('Image', ['$http', function($http) {
    
    return {
        list: function() {
            return $http.get('/api/images/');
        },
        
        getByStudy: function(studyId) {
            return $http.get('/api/images/getByStudy/' + studyId);
        },
        
        save: function(image) {
            return $http.post('/api/images', image);
        },
        
        delete: function(imageId) {
            return $http.delete('/api/images/', imageId);
        },
		create: function(studyId) {
			return $http.post('/api/images/', {"studyId": studyId});
		}
    }
}]);