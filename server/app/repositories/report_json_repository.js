var Basic_UnsatisfyingQualityCauses = require("../json/report/basicReport/unsatisfyingQualityCauses.json");
var fs = require('fs');

//================================================================
module.exports.getUnsatisfyingQualityCauses_Basic = function(version, callback) {
    
    //We make sure that the version of the report and the unsatisfyingCauses are the same
    if(version != Basic_UnsatisfyingQualityCauses.version)
    {
        callback("The report causes version is different from the latest one.", null);
    }
    
    callback(null, Basic_UnsatisfyingQualityCauses.causes);
    
};
