var db_rptBasic              = require('../../models/reports/rptBasic');

//================================================================
module.exports.save = function(report, /*version,*/ callback) {
    console.log(report.comments);
    console.log(report.studyID);
    console.log(report);
    
    //UPDATE
    if(report._id)
    {
        var report_Basic = {
            userID: report.userID,
            patientID: report.patientID,
            patientName: report.patientName,
            patientBirthdate: report.patientBirthdate,
            studyID: report.studyID,
            image: report.image,
            techQuality: report.techQuality ? report.techQuality : '',
            causes : report.causes ? report.causes : [],
            comments : report.comments ? report.comments : '',
            checked: report.checked
             };
        
        
        db_rptBasic.rptBasicModel.update({_id:report._id}
        ,report_Basic
        ,function(err){
            return callback(err, !err ? report._id : null);
        });
    }
    //CREATE
    else
    {    
        var report_Basic = new db_rptBasic.rptBasicModel({
            userID: report.userID,
            patientID: report.patientID,
            patientName: report.patientName,
            patientBirthdate: report.patientBirthdate,
            studyID: report.studyID,
            image: "ALLO",
            techQuality: report.techQuality ? report.techQuality : '',
            causes : report.causes ? report.causes : [],
            comments : report.comments ? report.comments : '',
            checked: false
        });
        
        report_Basic.save(function(err){
            return callback(err, report_Basic._id);
        });
    }
};

//================================================================
module.exports.getByStudyId = function(studyId, callback) {
    
    db_rptBasic.rptBasicModel.find({studyID:studyId}).exec(function(err, reports){
        var report = null;
        
        if(reports.length > 0)
        {
            report = reports[0];
        }
    
        return callback(err,report);
    });
};