var app = angular.module('medicalStudioApp', [
    'ngRoute'
    ,'appRoutesConfig'
    ,'ReportService'
    ,'ImageService'
    ,'PatientService'
    ,'StudyService'
    ,'UserService'
    ,'AuthenticationService'
    ,'AnnotationService'
    ,'TokenInterceptorService'
    ,'TokenInterceptorConfig'
    ,'HeaderCtrl'
    ,'SigninCtrl'
    ,'SignupCtrl'
    ,'ImageCtrl'
	,'PatientCtrl'
    ,'StudyCtrl'
    ,'UserCtrl'
    ,'ViewerCtrl'
    
    //Directives
    ,'RptMammographieCtrl'
    ,'RptBasicCtrl'
    
    ,'ui.bootstrap'
    ,'underscore'
]);

var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
    return window._;
});
