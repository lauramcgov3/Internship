angular.module('PDFJSViewerCtrl', []).controller('PDFJSViewerController', ['$scope', '$sce', '$modalInstance', "$window", "$location", 'PDFViewerService', 'pdfUrl', 'study', 'pdfDelegate', 'FileTransferUtils', function($scope, $sce, $modalInstance, $window, $location, PDFViewerService, pdfUrl, study, pdfDelegate, FileTransferUtils) {
    
    $scope.viewer = PDFViewerService.Instance("viewer");
    
    $scope.pdfUrl = function()
    {
        return  $sce.trustAsResourceUrl(pdfUrl);
    };
    
    $scope.prevPage = function() {
        $scope.viewer.prevPage();
    };
    
    $scope.nextPage = function() {
        $scope.viewer.nextPage();
    };
    
    $scope.currentPageChange = function() {
        $scope.viewer.gotoPage(parseInt($scope.currentPage));
    };
    
    $scope.zoomIn = function() {
        $scope.viewer.zoomIn();
    };
    
    $scope.zoomOut = function() {
        $scope.viewer.zoomOut();
    };
    
    $scope.reinitZoom = function() {
        $scope.viewer.reinitZoom();
    };
    
    $scope.export = function() {
        var currentDate = new Date();
        var dateString = currentDate.getFullYear().toString() + currentDate.getMonth().toString() + currentDate.getDate().toString() + currentDate.getHours().toString() + currentDate.getMinutes().toString() + currentDate.getSeconds().toString();
        
        $window.open("/api/reports/getReportStream/reportType/" + study.studyType.toLowerCase() +"/studyId/" + study.id + "/" + study.id + "_" + dateString + ".pdf");
    };
    
    $scope.close = function(){
        $modalInstance.close();
    }

    $scope.pageLoaded = function(curPage, totalPages) {
        $scope.currentPage = curPage;
        $scope.totalPages = totalPages;
    };
    
    //To close the popup on any page change
    $scope.$on('$locationChangeStart', function(event) {
        $scope.close();
    });
    
    window.addEventListener("unload", function(){
        $scope.close();
    });
    //END To close the popup on any page change
}]);
