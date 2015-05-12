var _                   = require('underscore');
var studyRepository     = require('../repositories/study_repository');


// ========================================================
/** 
* List the patient's studies that have a relevant type of images for the user.
* @param user {User} User for the one we want to get its relevant patients
* @param patientId {Long} Patient we want to get its relevant studies
* @param callback {function(code, result)} Callback of a function on the API layer
*/
module.exports.getRelevantByPatient = function(user, patientNiss, callback) {
    studyRepository.getRelevantByPatient(user, patientNiss, function(err, studies) {
        if (err) {
            return callback(500, err);
        }
        return callback(200, studies);
    });
}

// ========================================================
/** 
* Get all the different types of images .
* @param callback {function(code, result)} Callback of a function on the API layer
*/
module.exports.getAllTypes = function(callback) {
    studyRepository.getAllTypes(function(err, studies) {
        if (err) {
            return callback(500, err);
        }
        return callback(200, studies);
    });
};

// ========================================================
/** 
* Get all the studies by the NISS of a patient.
* @param callback {function(code, result)} Callback of a function on the API layer
*/
module.exports.delete = function(id, callback) {
    studyRepository.delete(id, function(err, studies) {
        if (err) {
            return callback(500, err);
        }
        return callback(200, studies);
    });
};

// ========================================================

module.exports.createStudy = function(patientNiss, callback) {
    studyRepository.saveStudy(patientNiss, function(err, study) {
        if (err) {
            return callback(500, err);
        }
			
		return callback(200, study);
	});
	
};


