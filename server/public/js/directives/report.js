/**
 * Directive permettant de faire un bouton avec action qui peux utiliser un service
 */
app.directive('report', ['$log', 'Report', 'FileTransferUtils', function ($log, Report, FileTransferUtils) {
    return {
        restrict: 'E',
        templateUrl: "/views/directives/report.html",
        controller: "@",
        name: "controllerName",
        scope:{
             study: "="
//            ,type: "@type"
            
        },        
        
        link: function (scope, element, attrs) {      
          
            /**
            * Report loading function
            */
            scope.getByReportTypeAndStudyId = function(reportType, studyId)
            {
                Report.getByReportTypeAndStudyId(reportType, studyId)
                .success(function(data){
                    scope.report = data;

                    //Now that we have our study, let's initialize our controller.
                    scope.initCtrl();
                })
                .error(function(status, data){
                    /**
                    * There are no saved report for this study. Let's create one client side that will be
                    * saved later on.
                    */
                    if(status == "Not created")
                    {
                        scope.report = {};
                        //Now that we have our study, let's initialize our controller.
                        scope.initCtrl();
                    }
                });
            }
            
            scope.updateView = function()
            {
                scope.getByReportTypeAndStudyId(scope.study.studyType, scope.study.id)
                scope.innerTemplate = "../views/directives/report/" + scope.study.studyType.toLowerCase() + ".html";
   
            }
            
            /**
            * When the value of the study changes, we want to go and load its report and to change the view.
            * We also make it isn't set to null. Otherwise, it could lead to weird issues.
            */
            scope.$watch('study', function (newValue, oldValue) {
                if(newValue != null)
                {
                    scope.updateView();
                }
            },true)
            
            /**
            * Generates a PDF
            */
            scope.getRapport = function()
            {
                Report.getReportPDF(scope.study.studyType.toLowerCase(), scope.study.id)
                .success(function(data){
                    console.log("REPORT RÉUSSI");       
                    
//                    var browserIsSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1);
                    
//                    FileTransferUtils.openPDFInBrowser(data);
//                    FileTransferUtils.openPDFInBrowserViaA(data, !browserIsSafari);
//                    FileTransferUtils.promptDownloadFile(data);
                    FileTransferUtils.openPDFViaPDFjs(data, scope.study);
                                   
                })
                .error(function(status, data){
                    console.log("ERREUR REPORT");
                    console.log(status);
                    console.log(data);
                });
            }
                
//            /*
//            * Initialise les données de la directive.
//            */
//            scope.init = function()
//            {
//                    scope.updateView();
//            }
//            scope.init();
            
        }
    };
}]);