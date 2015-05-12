var Study           = require('../databases/studies.json');
var audit           = require('../audit-log');
var path                   = require('path');
var uploadPathString       = 'images/studies';

// ========================================================
module.exports.postFiles = function (studyId, files, callback) {

	var studyId = studyId;
	
	var filePath = files.file.path;
	console.log('Old save path: ' + filePath);
	
	return callback(null, filePath, files);

};

	// application -------------------------------------------------------------
module.exports.getFiles = function (files, callback) {

	return callback(null, files);
};