angular.module('UploadService', []).factory('Upload', ['$http', function($http) {
    
    return {
        get: function() {
            return $http.get('/api/fileUpload/');
        },
        
        
        uploadFiles: function(studyId, data) {
            var fd = new FormData();
            fd.append('file', data.files);
            return $http.post('/api/fileUpload/studyId/' + studyId, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined} 
						//^Changes from standard json type to undefined, browser changes to multipart form data automatically
            });

//            return $http.post('/api/fileUpload/');
        }
    }
}]);