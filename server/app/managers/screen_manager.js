var screenRepository     = require('../repositories/screen_repository');
var mkdirp               = require('mkdirp');
var path                 = require('path');
var uploadPath           = path.resolve(__dirname + '/../../images/studiesScreens/');
var fs                   = require('fs');

// ========================================================
/** 
* Saves the image in a folder with a name based of the studyId, the laterality and the position of the image
* @param file {File} Image file to save
* @param studyId {Long} StudyId of the related image
* @param position {String} Image position
* @param laterality {String} Image laterality
* @param isValid {Boolean} Is the screen valid
* @param callback {function(code, result)} Function to execute once we get the result or an error
*/
exports.saveStageImage = function(file, studyId, position, laterality, isValid, callback){
    
    
    //1: We get the path of the existing image for the studyId, position and laterality we have
    screenRepository.getScreenInfos(studyId, position, laterality, function(err, screen){

        if(err){
            return callback(500, err);
        }
        
        //We define the new path of the file
        var path = uploadPath + '/' + studyId;
        
        //Creation of the study folder
        mkdirp(path, function(err) { 

            if(err){
                callback(500, err);
            }
            
            //We prepare our return function in order to be able to call it in the else callback or the if
            var fileMoveFunction = function(savePath){
                fs.rename(file.path, "/../../" + savePath, function(err){
                    if(err){
                        return callback(500, err);
                    }
                    return callback(200);
                });
            };
            
            
            //If there is already a screen existing for it, then we will replace it by using its exact path.
            if(screen)
            {
                console.log(screen);
                return fileMoveFunction(uploadPath + "/../../" + screen.path);
            }
            //Otherwise, we create the new entry for this new screen
            else{
                screenRepository.createScreenInfos(studyId, position, laterality, isValid, function(err, sPath){
                    
                    if(err){
                        return callback(500, err);
                    }
                    
                    return fileMoveFunction(uploadPath + "/../../" + sPath);
                });
            }

        });  
    });
};