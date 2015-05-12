var uploadManager  = require('../../managers/upload_manager');
var utils           = require('../../utils/utils');
var tokenManager = require('../../managers/token_manager');

// ========================================================
exports.getFiles = function(req, res) {
	
	//Intakes body & files from request (req)
	var body = req.body;
	var files = req.files;
	console.log('Get');
	
	//Passing files & body to uploadManager.getFiles function for validation 
    uploadManager.getFiles(files, body, function(code, result){
        return utils.defaultResponse(res,code,result);
    });  
};

exports.postFiles = function(req, res) {
	
	//Intakes body & files from request (req)
	var body = req.body;
	var files = req.files;
	var studyId = req.params.studyId;
	
	//Passing files & body to uploadManager.postFiles function for validation 
    uploadManager.postFiles(files, body, studyId, function(code, result){
        return utils.defaultResponse(res,code,result);
    });
};



