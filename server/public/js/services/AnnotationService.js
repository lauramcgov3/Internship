angular.module('AnnotationService', []).factory('Annotation', ['$http', function($http) {
    
    return {    
        getAllByImage: function(imageId) {
            return $http.get('/api/annotations/getAllByImage/' + imageId);
        },
        
        save: function(annotation) {
            return $http.post('/api/annotations', annotation);
        },
        
        delete: function(annotationId) {
            return $http.delete('/api/annotations/' + annotationId);
        },
        
        deleteAllByImage: function(imageId) {
            return $http.delete('/api/annotations/deleteAllByImage/' +  imageId);
        } 
    }
}]);