angular.module('PatientService', []).factory('Patient', ['$http', function($http) {
    return {
         list: function() {
            return $http.get('/api/patients/');
        },   
        
        getByUser: function(user) {
            return $http.get('/api/patients/getByUser/' + user);
        },
        
        getByNiss: function(patientNiss) {
            return $http.get('/api/patients/getByNiss/' + patientNiss);
        }
    }
}]);