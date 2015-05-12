var patientManager  = require('../../managers/patient_manager');
var userManager     = require('../../managers/user_manager');
var utils           = require('../../utils/utils');
var tokenManager = require('../../managers/token_manager');

// ========================================================
exports.list = function(req, res) {
    patientManager.list(function(code, result){
        return utils.defaultResponse(res,code,result);
    });  
};

// ========================================================
exports.getByUser = function(req, res) {
    var token = tokenManager.getToken(req.headers);
    userManager.getInformation(token, function (code, user) {
        if (code && code != 200) {
            return res.send(code);
        }
        
        patientManager.getByUser(user.id, function(code, result){
            return utils.defaultResponse(res,code,result);
        });
    });
};

// ========================================================
exports.getByNiss = function(req, res) {
    var NISS    = req.params.niss;
    
    patientManager.getByNiss(NISS, function(code, result){
        return utils.defaultResponse(res,code,result);
    });  
}
