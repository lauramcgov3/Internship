var imageRepository     = require('../repositories/image_repository');

// ========================================================
/** 
* Get a list of all images
* @param callback {function(code, result)} Function to execute once we get the result or an error
*/
exports.list = function(callback) {
    imageRepository.list(function(err, images) {
        if (err) {
            return callback(500, err);   
        }
        return callback(200, images);  
    });
};

// ========================================================
/** 
* Get a list of all images related to a study
* @param studyId {Long} Id of the study that we want its images
* @param callback {function(code, result)} Function to execute once we get the result or an error
*/
exports.getByStudy = function(studyId, callback) {
    imageRepository.getByStudy(studyId, function(err, images) {
        if (err) {
            return callback(500, err);   
        }
        return callback(200, images);  
    });  
};

// ========================================================
/** 
* Save an image for a study
* @param image {image} Image to save
* @param callback {function(code, result)} Function to execute once we get the result or an error
*/
exports.save = function(studyId, callback) {
	
    imageRepository.save(studyId, function(err, imageId) {
		console.log('here');
        if (err) {
            return callback(500, err);   
        }
		console.log(imageId);
		console.log('And here too..');
        return callback(200, imageId);
    });  
};
// ========================================================
/** 
* Delete an image
* @param id {Long} Image to delete
* @param callback {function(code, result)} Function to execute once we get the result or an error
*/
exports.delete = function(id, callback) {
    imageRepository.delete(id, function(err, images) {
        if (err) {
            return callback(500, err);   
        }
        return callback(200, images);  
    });  
};


	