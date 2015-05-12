/**
 * Directive permettant de faire un bouton avec action qui peux utiliser un service
 */
app.directive('searchPanel', ['$log', function ($log) {
    return {
        restrict: 'E',
        templateUrl: '/views/directives/searchPanel.html',
        scope:{
             searchFunction: "&"
            ,innerTemplate: "@innerTemplate"
         },
        link: function (scope, element, attrs) {    

            /**
            * Search parameters
            */
            scope.searchParams = {
                isAdvancedSearch: false,
                globalSearch: ""
            };        
            
            /**
            * Calls the search function we received from the controller giving it the searchParams for a global search.
            */
            scope.globalSearch = function()
            {
                scope.searchParams.isAdvancedSearch = false;
                scope.searchFunction()(scope.searchParams);
            }
            
            
            /**
            * Calls the search function we received from the controller giving it the searchParams for an advanced search.
            */
            scope.advancedSearch = function()
            {
                scope.searchParams.isAdvancedSearch = true;
                scope.searchFunction()(scope.searchParams);
            }
            
            /**
            * Erase the text from the global search text input
            */
            scope.removeGlobalSearchText = function()
            {
                scope.searchParams.globalSearch = "";
            }
            
            /**
            * We adjust the arrow class depending on if the collapsable is closed or open. I would have prefered using an 
            * AngularJS way to deal with it, but I didn't find any. I also tried to $watch the class change but it didn't fire
            * the first times.
            */
//            scope.arrow = function()
//            {
//                scope.arrowClass = scope.arrowClass != "glyphicon-chevron-up" ? "glyphicon-chevron-up" : "glyphicon-chevron-down";   
//            }
            
            /**
            * The arrow work perfectly with this pure Javascript-jQuery solution, but I have to verifiy which one Vincent prefer
            * first.
            */
            $($("#searchPanel_btnCollapse")).on('click', function (e, rowid) {
               scope.$apply(function(){
                scope.arrowClass = $("#searchPanel_btnCollapse").attr("class").indexOf("collapsed") > -1 ? "glyphicon-chevron-up" : "glyphicon-chevron-down";   
               });
            });
            
            
        /**
         * Configuration du DateTimePicker
         */
        scope.formats = ['dd MMMM yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        scope.format = scope.formats[0];
        scope.datepicker = {};
        scope.open = function ($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            
            scope.datepicker[opened] = !scope.datepicker[opened]; 
        };          
            
                    
        /*
        * Initialise les données de la directive.
        */
        scope.init = function()
        {
            scope.arrowClass = "glyphicon-chevron-down";
        }
        scope.init();
            
        }
    };
}]);