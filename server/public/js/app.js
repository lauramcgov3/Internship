var app = angular.module('medicalStudioApp', [
    'ngRoute'
    ,'ngSanitize'
    ,'appRoutesConfig'
    ,'ReportService'
    ,'ImageService'
    ,'PatientService'
    ,'StudyService'
    ,'UserService'
    ,'DrawerService'
    ,'ToolService'
	,'UploadService'
    ,'ImageService'
    ,'ZoomAndPanService'
    ,'AuthenticationService'
    ,'AnnotationService'
    ,'ScreenService'
    ,'TokenInterceptorService'
    ,'TokenInterceptorConfig'
    ,'HeaderCtrl'
    ,'SigninCtrl'
    ,'SignupCtrl'
    ,'ImageCtrl'
	,'PatientCtrl'
    ,'StudyCtrl'
    ,'UserCtrl'
	,'UploadCtrl'
    ,'ViewerCtrl'
    ,'CanvasImageService'
    
    //Angular-pdf-viewer
    ,'pdf'
    
    //ngPdfViewer
    ,'ngPDFViewer'
//    ,'ngPDFViewer_Edit'
    
    //Directives
    ,'RptMammographieCtrl'
    ,'RptBasicCtrl'
    
    //Filetransfer
    ,'FileTransferUtilsService'
    
    //Modal
    ,'StudyCreationMoreInfoCtrl'
    ,'StudyCreationModifyInfoCtrl'
    ,'PDFJSViewerCtrl'
    ,'MessageAnnotationCtrl'    
    
    ,'ui.bootstrap'
    ,'underscore'
]);

var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
    return window._;
});
