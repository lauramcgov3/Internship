angular.module('StudyCtrl', []).controller('StudyController', ['$scope', '$routeParams', '$location', 'Patient', 'Study', '$modal', function($scope, $routeParams, $location, Patient, Study, $modal) {
    
    $scope.studies = [];
    $scope.patient = {};
    
    var patientNiss = $routeParams.id;
    
    $scope.getRelevantByPatient = function getRelevantByPatient(patientNiss) {
        Study.getRelevantByPatient(patientNiss)
        .success(function(data) {
            $scope.studies = data;
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
    
    $scope.openPopup = function()
    {
        var modalInstance = $modal.open({
            templateUrl: '/views/modal/studyCreation/studyCreationModifyInfo.html',
            controller: 'StudyCreationModifyInfoController',
            resolve: {
                activiteEdit: function () {
                    return null;
                }
            }
        });

        modalInstance.result.then(function (activite) {
           console.log(activite);
        });
    }
    
    $scope.init = function()
    {
        $scope.getRelevantByPatient(patientNiss);
        $scope.getPatientInfos(patientNiss);
    }
    $scope.init();
    
}]);
