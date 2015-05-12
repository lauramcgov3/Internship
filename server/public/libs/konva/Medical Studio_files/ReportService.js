angular.module('ReportService', []).factory('Report', ['$http', function($http) {
    return {
        getUnsatisfyingQualityCauses : function(reportType, version) {
            return $http.get('/api/reports/getUnsatisfyingQualityCauses/reportType/' + reportType + '/version/' + version);
        },
        save: function(report, reportType)
        {
            return $http.post('/api/reports/reportType/' + reportType, report);
        },
        getByReportTypeAndStudyId: function(reportType, studyId)
        {
            return $http.get('/api/reports/reportType/' + reportType + '/studyId/' + studyId);
        },
        getReportPDF: function()
        {
            return $http.get('/api/reports/getReportTest');
        }
    }
        
}]);