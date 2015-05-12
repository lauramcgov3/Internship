angular.module('PatientCtrl', []).controller('PatientController', ['$scope', '$location', 'Patient', 'User', function($scope, $location, Patient, User) {
    
    $scope.patients = [];
    getPatients();
    
    function getPatients() {
          Patient.list()
          .success(function(data) {
              $scope.patients = data;
          }).error(function(status, data) {
              console.log(status);
              console.log(data);
          });
    };
    
    $scope.openStudies = function openStudies(patient) {
        $location.path("/patient/" + patient.NISS);
    }
    
    $scope.updateStudiesFromSearch = function(searchParams){
        //debugger;
    }    
}]);
