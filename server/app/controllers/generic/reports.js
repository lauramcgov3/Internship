var reportManager   = require('../../managers/report_manager');
var utils           = require('../../utils/utils');
var tokenManager    = require('../../managers/token_manager');
var jsonwebtoken    = require('jsonwebtoken');
var pdf             = require('html-pdf');

// ========================================================
exports.getUnsatisfyingQualityCauses = function(req, res) {
    var reportType = req.params.reportType;
    var version = req.params.version;
    
    reportManager.getUnsatisfyingQualityCauses(reportType, version, function(code, result){
        return utils.defaultResponse(res,code,result);
    });  
};

// ========================================================
exports.save = function(req, res) {

    var report = req.body;
    var reportType = req.params.reportType;
    //var version = req.params.version;
    
    //We add the userID to the report
    var token = tokenManager.getToken(req.headers);
    report.userID = jsonwebtoken.decode(token).id;

    reportManager.save(report, reportType/*, version*/, function(code, result){
        console.log(code);
        return utils.defaultResponse(res,code,result);
    });
};

// ========================================================
exports.getByReportTypeAndStudyId = function(req, res) {
    var reportType = req.params.reportType;
    var studyId = req.params.studyId;
    
    reportManager.getByReportTypeAndStudyId(reportType, studyId, function(code, result){
        return utils.defaultResponse(res,code,result);
    });  
};

// ========================================================
exports.getReportPDF = function(req, res) {
    var reportType = req.params.reportType;
    var studyId = req.params.studyId;

    reportManager.getReportHTML(reportType, studyId, "buffer", function(code, result){
        console.log(code);
        if(code && code != 200) 
        {
            return utils.defaultResponse(res, code, result);
        }
        
        res.writeHead(200, { 'Content-disposition': 'attachment', 'Content-Type': 'application/pdf'});
        res.end(result.toString('base64'));
    });
};


// ========================================================
exports.getReportPDFStream = function(req, res) {
    var reportType = req.params.reportType;
    var studyId = req.params.studyId;

    reportManager.getReportHTML(reportType, studyId, "stream", function(code, result){
        console.log(code);
        if(code && code != 200) 
        {
            return utils.defaultResponse(res, code, result);
        }
        console.log(result);
        result.pipe(res);
        
//        res.writeHead(200, { 'Content-disposition': 'attachment', 'Content-Type': 'application/pdf'});
//        res.end(result.toString('base64'));
    });
};