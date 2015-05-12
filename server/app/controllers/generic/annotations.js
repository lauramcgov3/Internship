var jsonwebtoken        = require('jsonwebtoken');
var tokenManager        = require('../../managers/token_manager');
var audit               = require('../../audit-log');
var annotationManager   = require('../../managers/annotation_manager');
var utils               = require('../../utils/utils');

//================================================================
exports.getAllByImage = function(req, res) {
    var imageId = req.params.imageId;
    annotationManager.getAllByImage(imageId, function(code, result){
        return utils.defaultResponse(res,code,result);
    });
};

//================================================================
exports.save = function(req, res) {
    var annotation = req.body;
    
    annotationManager.save(annotation, function(code, result){
        return utils.defaultResponse(res,code,result);
    });
};

//================================================================
exports.delete = function(req, res) {
    var id = req.params.id;
    annotationManager.delete(id, function(code, result){
        return utils.defaultResponse(res,code,result);
    });
};

//================================================================
exports.deleteAllByImage = function(req, res) {
    var imageId = req.params.imageId;
    
    annotationManager.deleteAllByImage(imageId, function(code, result){
        return utils.defaultResponse(res,code,result);
    });
};

