var jsonwebtoken    = require('jsonwebtoken');
var tokenManager    = require('../../managers/token_manager');
var audit           = require('../../audit-log');
var studyManager    = require('../../managers/study_manager');
var userManager     = require('../../managers/user_manager');
var utils           = require('../../utils/utils');

// ========================================================
exports.getRelevantByPatient = function(req, res) {
    var token = tokenManager.getToken(req.headers);
    var patientId = req.params.niss;

    if (token != null) {
        var actorID = jsonwebtoken.decode(token).id;
        // First, get the user's information
        userManager.getInformation(actorID, function (code, user) {
            if (code && code != 200) {
                return res.send(code);
            }
            
            studyManager.getRelevantByPatient(user, patientId, function(code, result) {
                return utils.defaultResponse(res,code,result);
            });
        });
    }
    else {
        audit.logEvent('[anonymous]', 'Studies ctrl', 'List relevant by patient', 'patient.NISS', req.params.NISS, 'failed','The user was not authenticated');
        return res.send(401); 
    }   
};

// ========================================================
exports.getAllTypes = function(req, res) {
    studyManager.getAllTypes(function(code, result){
        return utils.defaultResponse(res,code,result);
    });
};

// ========================================================
exports.delete = function(req, res) {
    var id = req.params.id;
    
    studyManager.delete(id, function(code, result){
        return utils.defaultResponse(res,code,result);
    });
};

// ========================================================
exports.createStudy = function(req, res) {
	
	var patientNiss = req.body.patientNiss;
	
	studyManager.createStudy(patientNiss, function(code,result){
		
		var studyId = result;
		return utils.defaultResponse(res,code,result);
	});
};
