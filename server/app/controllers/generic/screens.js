var screenManager    = require('../../managers/screen_manager');
var utils           = require('../../utils/utils');

// ========================================================
exports.saveStageImage = function(req,res){
    
    var file = req.files.file;
    var studyId = req.params.studyId;
    var position = 'CC'; //req.params.position;
    var laterality = 'R'; //req.params.laterality;
    var isValid = true; //req.params.isValid;
    
    screenManager.saveStageImage(file, studyId, position, laterality, isValid, function(code, result){
        return utils.defaultResponse(res,code,result);
    });
}


