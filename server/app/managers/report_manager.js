var report_json_Repository      = require('../repositories/report_json_repository');

//BasicReport
var basicReport_Repository      = require('../repositories/reports/basicReport_repository');
var basicReport_Manager         = require('./reports/basicReport_manager');

var pdf                         = require('html-pdf');
var fs                          = require("fs");
var ejs                         = require('ejs');
var path                        = require('path');
var options_default             = require('../ejs-templates/reports/options/default');

//================================================================
/** 
* Get unsatisfying quality causes
* @param reportType {String} Type of the report.
* @param version {String} Version of the report.
* @param callback {function(code, result)} Callback of a function on the API layer
*/
exports.getUnsatisfyingQualityCauses = function(reportType, version, callback) {
    
    switch(reportType.toLowerCase())
    {
        case "basic":
            report_json_Repository.getUnsatisfyingQualityCauses_Basic(version, function (err, causes) {
                if (err) {
                    return callback(500, err);   
                }
                return callback(200, causes);               
            });
        break;
        default:
            console.log("Tried to reach unsatisfying quality causes for" + reportType + ", which isn't implemented");
            return callback(500, "Not implemented Report Type");            
        break;
    }

};

//================================================================
/** 
* Saves a report
* @param report {Report} Report to save
* @param reportType {String} Type of the report.
* @param version {String} Version of the report.
* @param callback {function(code, result)} Callback of a function on the API layer
*/
exports.save = function(report, reportType, /*version,*/ callback) {
    
    switch(reportType.toLowerCase())
    {
        case "basic":
            basicReport_Repository.save(report, /*version,*/ function (err, report) {
                if (err) {
                    return callback(500, err);   
                }
                
                return callback(200, report);               
            });
        break;
        default:
            console.log("Tried to save a report having " + reportType + " as type which isn't implemented");
            return callback(500, "Not implemented Report Type");            
        break;
    }

};

//================================================================
/** 
* Get a report by its reportType and its study. If it doesn't exist, it creates it.
* @param reportType {String} Type of the report
* @param studyId {String} Id of the study that we want it's report
* @param callback {function(code, result)} Callback of a function on the API layer
*/
exports.getByReportTypeAndStudyId = function(reportType, studyId, callback) {
    
    switch(reportType.toLowerCase())
    {
        case "basic":
            basicReport_Repository.getByStudyId(studyId, function (err, report) {
                if (err) {
                    return callback(500, err);   
                }
                
                if(!report)
                {
                    return callback(500, "Not created");
                }
                
                return callback(200, report);               
            });
        break;
        default:
            console.log("Tried to save a report having " + reportType + " as type which isn't implemented");
            return callback(500, "Not implemented Report Type");            
        break;
    }

};

//================================================================
/** 
* Get a report as a HTML object.
* @param reportType {String} Type of the report
* @param studyId {String} Id of the study that we want it's report
* @param outputFormat {String} Type of PDF export wanted (buffer or stream)
* @param callback {function(code, result)} Callback of a function on the API layer
*/
exports.getReportHTML = function(reportType, studyId, outputFormat, callback) {

    console.log(reportType);
    
    //The return function will be the same everytime, so let's declare it here.
    var managerCallback = function (err, reportPDFHtml) {
        if (err) {
            return callback(500, err);   
        }

        //Create the footer
        var pathFile = path.join(__dirname, '/../ejs-templates/reports/header-footer/footer.ejs');
        fs.readFile(pathFile, 'utf-8', function(err, footerEJS) {

            if(err) {
                return callback(500, err);
            }

            var footerData = {
                "cssLink": path.join('file:///',__dirname, '/../../ejs-templates/reports/style/footer.css')
            };
            var footer_html = ejs.render(footerEJS, footerData);
            console.log(footer_html);

            options_default.footer = {
                "height": "10mm",
                "contents" : footer_html
             };

            if(outputFormat == "buffer"){
                //Now that we have our report as HTML, transform it to buffer
                pdf.create(reportPDFHtml, options_default).toBuffer(function(err, buffer){

                    if(err){
                        return callback(500, err);
                    }

                    return callback(200, buffer);
                });
            }
            else if(outputFormat == "stream")
            {
                //Now that we have our report as HTML, transform it to buffer
                pdf.create(reportPDFHtml, options_default).toStream(function(err, stream){

                    if(err){
                        return callback(500, err);
                    }

                    return callback(200, stream);
                });
            }
        });
    }
    //END managerCallback
    
    
    switch(reportType.toLowerCase())
    {
        case "basic":
            basicReport_Manager.getReportHTML(studyId, managerCallback);
        break;
        default:
            console.log("Tried to save a report having " + reportType + " as type which isn't implemented");
            return callback(500, "Not implemented Report Type");            
        break;
    }

};