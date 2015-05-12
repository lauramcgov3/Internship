var patientRepository     = require('../repositories/patient_repository');

// ========================================================
/** 
* Get all the patients distinctly
* @param callback {function(code, result)} Callback of a function on the API layer
*/
module.exports.list = function(callback) {
    patientRepository.list(function(err, patients) {
        if (err) {
            return callback(500, err);   
        }
        return callback(200, patients); 
    });
}

// ========================================================
/** 
* Get all the patients by user
* @param userId {Long} User for the one we want its patients.
* @param callback {function(code, result)} Callback of a function on the API layer
*/
module.exports.getByUser = function(userId, callback) {
    
    patientRepository.getByUser(userId, function(err, patients) {
        if (err) {
            return callback(500, err);   
        }
        return callback(200, patients); 
    });
}

// ========================================================
/** 
* Get a patient by it's NISS
* @param NISS {String} Niss number of the patient we are looking for.
* @param callback {function(code, result)} Callback of a function on the API layer
*/
module.exports.getByNiss = function(NISS, callback) {
    patientRepository.getByNiss(NISS, function(err, patient) {
        if (err) {
            return callback(500, err);
        }
        return callback(200, patient);
    });
}
