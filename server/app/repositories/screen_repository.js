var db_screen              = require('../models/screen');
var path                   = require('path');
var uploadPathString       = 'images/studiesScreens';

// ========================================================
/** 
* Get a screen information based on its studyId, it's position and the laterality
* @param studyId {Long} StudyId of the related image
* @param position {String} Image position
* @param laterality {String} Image laterality
* @param callback {function(err, screen)} Function to execute once we get the result or an error
*/
exports.getScreenInfos = function(studyId, position, laterality, callback){
    
    db_screen.screenModel.find({studyId:studyId, position:position, laterality:laterality})
    .exec(function(err, screens){
        var screen = null;
        
        if(screens.length > 0)
        {
            screen = screens[0];
        }
        
        return callback(err, screen);
        
    });
    
}

// ========================================================
/** 
* Get all screen for a study
* @param studyId {Long} StudyId of the screens to get
* @param callback {function(err, screen)} Function to execute once we get the result or an error
*/
exports.getAllByStudyId = function(studyId, callback){
    
    db_screen.screenModel.find({studyId:studyId})
    .exec(function(err, screens){
        return callback(err, screens);
    });
}
          
// ========================================================
/** 
* Create a screen information based on its studyId, it's position and the laterality
* @param studyId {Long} StudyId of the related image
* @param position {String} Image position
* @param laterality {String} Image laterality
* @param isValid {Boolean} Is the screen valid (has all its information)
* @param callback {function(err, screen)} Function to execute once we get the result or an error
*/
exports.createScreenInfos = function(studyId, position, laterality, isValid, callback){
    
    var filePath = uploadPathString + "/" + studyId + "/" + laterality + "_" + position + ".png"; //TODO 
    
    var screen = new db_screen.screenModel({
        studyId: studyId,
        position: position,
        laterality: laterality,
        path : filePath,
        isValid : isValid
    });
    console.log(screen);
    screen.save(function(err){
        return callback(err, filePath);
    });

    
}