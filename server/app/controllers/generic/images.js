var jsonwebtoken    = require('jsonwebtoken');
var tokenManager    = require('../../managers/token_manager');
var audit           = require('../../audit-log');
var imageManager    = require('../../managers/image_manager');
var utils           = require('../../utils/utils');

// The token verification should be done when the route is called.
exports.list = function(req, res) {
    imageManager.list(utils.defaultResponse);
};

// ========================================================
exports.getByStudy = function(req, res) {
    var studyId = req.params.studyId;
    
    imageManager.getByStudy(studyId, function(code, result) {
        return utils.defaultResponse(res,code,result);
    });  
};

// ========================================================
exports.save = function(req, res) {
    var studyId = req.body.studyId;
    
    imageManager.save(studyId, function(code, result){
		var imageId = result;
		console.log('Result: ' + result);
        return utils.defaultResponse(res,code,result);
    }); 
};

// ========================================================
exports.delete = function(req,res){
    var id = req.params.id;
    
    imageManager.delete(id, function(code, result){
        return utils.defaultResponse(res,code,result);
    });
};
