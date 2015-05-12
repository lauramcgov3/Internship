var Study = require('../databases/studies');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var db_image = require('../models/image');

// ========================================================
module.exports.list = function (callback) {
	var images = [];
	Study.forEach(function (study) {
		study.images.forEach(function (image) {
			images.push(image);
		});
	});

	return callback(null, images);
};

// ========================================================
module.exports.getByStudy = function (studyId, callback) {
	var images = [];

	Study.forEach(function (study) {
		if (study.id === studyId) {
			study.images.forEach(function (image) {
				// Create an absolute path based on directory name and relative path to the file
				var filePath = path.join(__dirname, image.fileLocation);
				// Get the file
				var file = fs.readFileSync(filePath);
				// Convert the file into base64
				var buffer = new Buffer(file).toString('base64');
				// Format into image source format readable by HTML

				image.base64 = 'data:image/jpg;base64,' + buffer;

				images.push(image);
			});
		}
	});

	setTimeout(function () {
		return callback(null, images);
	}, 500);
};

// ========================================================
module.exports.save = function (studyId, callback) {
 
        var studyNum = studyId;
		//console.log('Image repo: ' + studyNum);
 
 
        var image = new db_image.imageModel({
                studyNum: studyNum,
                imagePath: 'undef',
                laterailty: 'R',
                position: 'CC'
        });
 
        //imageId = image._id;
 
        console.log('Image schema ' + image);
		
		imageId = image._id;
		image.save(function(err){
			return callback(null, imageId);
		});
};

// ========================================================
module.exports.delete = function (id, callback) {
	//    var images = [];
	//    Study.forEach(function(study) {
	//        study.images.forEach(function(image) {
	//            images.push(image);
	//        });
	//    });

	return callback(999, images);
};

// ========================================================

//module.exports.find = function(imageId, callback) {

