/**
 * Directive permettant de faire un bouton avec action qui peux utiliser un service
 */
app.directive('report', ['$log', 'Report', function ($log, Report) {
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
                    console.log("GET RÉUSSI!");
                    
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
                    console.log("GET ERREUR");
                });
            }
            
            scope.updateView = function()
            {
                scope.getByReportTypeAndStudyId(scope.study.studyType, scope.study.id)
                scope.innerTemplate = "../views/directives/report/" + scope.study.studyType.toLowerCase() + ".html";
   
            }
            
            /**
            * When the value of the study changes, we want to go and load it's report and to change the view.
            * We also make it isn't set to null. Otherwise, it could lead to weird issues.
            */
            scope.$watch('study', function (newValue, oldValue) {
                if(newValue != null && newValue != oldValue)
                {
                    scope.updateView();
                }
            },true)
            
            /**
            * Generates a PDF
            */
            scope.pdfTest = function()
            {
                Report.getReportPDF()
                .success(function(data){
                    console.log("REEEEEEPORT RÉUSSI");
                    console.log(data);
                })
                .error(function(status, data){
                    console.log("ERREUR REEEEEEEEPORT");
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