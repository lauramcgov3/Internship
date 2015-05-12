var basicReport_Repository      = require('../../repositories/reports/basicReport_repository');
var studyRepository             = require('../../repositories/study_repository');
var report_json_Repository      = require('../../repositories/report_json_repository');
var screen_Repository           = require('../../repositories/screen_repository');
var ejs                         = require('ejs');
var fs                          = require('fs');
var path                        = require('path');
var screensUtils                = require('../../utils/screensUtils');

//================================================================
module.exports.getReportHTML = function(studyId, callback) {
    
    //Step 1: Get the required study
    studyRepository.getById(studyId, function(err, study){
    
        if(err)
        {
            return callback(err);
        }

        //Step 2: Get the required report
        basicReport_Repository.getByStudyId(studyId, function (err, report) {
    
            if(err)
            {
                return callback(err);
            }
            
            //Step 3: Get the basic report causes
            report_json_Repository.getUnsatisfyingQualityCauses_Basic("0.1", function(err, causes){
                
                //Step 4: Get the images
                screen_Repository.getAllByStudyId(studyId, function(err, screens){
                    
                    //We now have a report. It's time to format it to have a good data object for the report view.        
                    var pdfData = {
                        "study": study,
                        "report": report,
                        "serverFolderPath": path.join('file:///',__dirname, '/../../../'),
                        "screens": screens,
                        "screenFilter" : screensUtils.screenFilter
                    };
                    
                    if(report.techQuality != "yes"){
                        //Filter for the unsatisfying causes
                        var causesFilter = function(value, index, ar){
                            return report.causes.indexOf(value.id) > -1;
                        }

                        pdfData.unsatisfyingCauses = causes.filter(causesFilter);
                    }

                    console.log(pdfData);

                    var pathFile = path.join(__dirname, '/../../ejs-templates/reports/basicReport.ejs');
                    fs.readFile(pathFile, 'utf-8', function(err, data) {
                        if(err) {
                            callback(err,data);
                        }

                        var html = ejs.render(data, pdfData);
                        console.log(html);
                        return callback(null, html);
                    });
                });
            });
        });
    });
}