angular.module('StudyService', []).factory('Study', ['$http', function($http) {
    return {
        getRelevantByPatient : function(patientId) {
            return $http.get('/api/studies/getRelevantByPatient/' + patientId );
        },
        
        getAllTypes : function() {
            return $http.get('/api/studies/getAllTypes');
        },
        
        delete: function(studyId) {
            return $http.delete('/api/studies/' + studyId);
        }    
    }
        
}]);