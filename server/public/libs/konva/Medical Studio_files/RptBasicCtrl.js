angular.module('RptBasicCtrl', []).controller('RptBasicController', ['$scope', '$routeParams', 'Report', '$timeout', function($scope, $routeParams, Report, $timeout) {
    
    //Scope utilitaries variables
    $scope.utils = {
        saveTimout : null    
    }
    
    $scope.getUnsatisfyingQualityCauses = function()
    {
        Report.getUnsatisfyingQualityCauses('basic', '0.1')
          .success(function(data) {
              $scope.causes = data;
            
            //We initalize the causes that have to be checked
            //If the report is not initalized yet, we won't.
            if($scope.report == null || $scope.report.causes == null) return;
            
            angular.forEach($scope.causes, function(cause) {
                    cause.checked = $scope.report.causes.indexOf(cause.id) >= 0;
            });
            
          }).error(function(status, data) {
              console.log(status);
              console.log(data);
          });
    }
    
    $scope.resetCauses = function()
    {
        angular.forEach($scope.causes, function(cause) {
            cause.checked = false;
        });
        
        $scope.report.causes = [];
    }
    
    $scope.selectCause = function(cause)
    {
        if(!$scope.report.causes)
        {
            $scope.report.causes = [];
        }
        
        var indexOfCause = $scope.report.causes.indexOf(cause.id);
        
        //We remove the cause if it's found
        $scope.report.causes.splice(indexOfCause, indexOfCause >= 0 ? 1 : 0);
        
        //We add the new cause if it was now already there
        if(indexOfCause < 0)
        {
            $scope.report.causes.splice(0, 0, cause.id);
        }

        cause.checked = !cause.checked;
    }
    
    $scope.initCtrl = function()
    {
        $scope.getUnsatisfyingQualityCauses();
    }
    
    /**
    * Saves the current report
    */
    $scope.saveReport = function()
    {
        if($scope.report != null)
        {
            $scope.report.studyID = $scope.study.id;
            $scope.report.patientID = $scope.study.patient.NISS;
            $scope.report.patientName = $scope.study.patient.name;
            $scope.report.patientBirthdate = $scope.study.patient.birthdate;
            $scope.report.patientBirthdate = $scope.study.patient.birthdate;

            Report.save($scope.report, 'Basic')
            .success(function(data){
                
                //If we inserted a new report, we want to replace there shown report instead of it.
                if(data != "1"){
                    $scope.report = data;
                }
                console.log("SAUVEGARDÉ");
            })
            .error(function(status, data){
                console.log("ERREUR SAUVEGARDE");
            });
        }
    }
    
    /**
    * Delayed report save. The report will be saved when not changed for 5 consecutives seconds.
    */
    $scope.$watch('report', function (newValue, oldValue) {
        if (newValue != null && newValue != oldValue) {
          if ($scope.utils.saveTimout) {
            $timeout.cancel($scope.utils.saveTimout)
          }
          $scope.utils.saveTimout = $timeout($scope.saveReport, 5000);  // 1000 = 1 second
        }
    }, true);
    
}]);