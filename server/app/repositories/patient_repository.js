var Study           = require('../databases/studies.json');
var audit           = require('../audit-log');

// ========================================================
module.exports.list = function(callback) {
    var patients = [];
    Study.forEach(function(study) {
    var currentPatient = study.patient;
        var contains = false;
        patients.forEach(function(patient) {
            if (patient.NISS !== undefined && currentPatient.NISS !== undefined) {
                if (patient.NISS == currentPatient.NISS) {
                    contains = true;
                }
            }
        });
        if (!contains) {
            patients.push(currentPatient);
        }        
    }); 
    return callback(null, patients);
}

// ========================================================
module.exports.getByUser = function(userId, callback) {

    return callback(999, patients);
}

// ========================================================
module.exports.getByNiss = function(NISS, callback) {
    var patient = undefined;
    Study.forEach(function(study) {
        if (study.patient.NISS == NISS) {
            patient = study.patient;   
        }
    });
    
    if (patient === undefined) {
        audit.logEvent('[mongodb]', 'Patient Repository', 'Get by Niss', 'Niss', NISS, 'failed', 'There is no patient corresponding to that NISS.');
        return callback('There is no patient corresponding to that NISS.', null);
    }
    return callback(null, patient);
}