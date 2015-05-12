angular.module('StudyCtrl', []).controller('StudyController', ['$scope', '$routeParams', '$location', 'Patient', 'Study', function($scope, $routeParams, $location, Patient, Study) {
    
    $scope.studies = [];
    $scope.patient = {};
    
    var patientNiss = $routeParams.id;
    
    $scope.getRelevantByPatient = function getRelevantByPatient(patientNiss) {
        Study.getRelevantByPatient(patientNiss)
        .success(function(data) {
            $scope.studies = data;
            $scope.currentStudy = data[0];
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });
    };
    
    $scope.updateStudiesFromSearch = function (lstStudies)
    {
        $timeout(function() {
            readImages();
        }, 500);
    }
    
    $scope.getPatientInfos = function(patientNiss)
    {
        Patient.getByNiss(patientNiss)
        .success(function(data) {
            $scope.patient = data;
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
            
        });
    }
    
    $scope.openViewer = function(studyID) {
        $location.path('/viewer/' + studyID);
    }
    
    $scope.openReport = function(study)
    {
        $scope.currentStudy = study;   
    }
    
    $scope.init = function()
    {
        $scope.getRelevantByPatient(patientNiss);
        $scope.getPatientInfos(patientNiss);
    }
    $scope.init();
    
}]);
