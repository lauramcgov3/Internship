var Study = require('../databases/studies.json');
var _ = require('underscore');
var db_study = require('../models/study');
var dateFormat = require('dateformat');

// ========================================================
// List the patient's studies that have a relevant type of images for the user.
module.exports.getRelevantByPatient = function (user, patientNiss, callback) {
	var studies = [];
	Study.forEach(function (study) {

		if (study.patient.NISS == patientNiss) {
			user.relevantTypes.forEach(function (type) {
				if (type.type == study.type && type.relevant == true) {
					study.nbImages = Object.keys(study.images).length;
					studies.push(study);
				}
			});
		}
	});
	return callback(null, studies);
}

// ========================================================
// Get all the different types of images.
module.exports.getAllTypes = function (callback) {
	var types = [];

	Study.forEach(function (study) {
		types.push(study.type);
	});

	types = _.union(types, types);
	return callback(null, types);
};

// ========================================================
//Delete study
module.exports.delete = function (id, callback) {
	return callback(999, id);
};

// ========================================================
// Get a study by its ID
module.exports.getById = function (studyId, callback) {
	console.log(Study);

	var study = null;
	for (var i = 0; i < Study.length; i++) {
		study = Study[i];
		console.log(study);
		if (study.id == studyId) {
			return callback(null, study);
		}
	}

	return callback('Not found');
}

module.exports.createStudy = function (callback) {
	return callback(999);
};

// ========================================================
// Create a study

module.exports.saveStudy = function (patientNiss, callback) {

	
	//Formatting the date to dd-mm-yyyy
	var dateNow = new Date();
	var dd = dateNow.getDate();
	var monthSingleDigit = dateNow.getMonth(),
		mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit; // if the month is less than 10, eg 4, make it 04
	var yy = dateNow.getFullYear();
	var formattedDate = dd + '-' + mm + '-' + yy; // Returning the finalised formatted date

	//Creating the new study in MongoDB
	var study = new db_study.studyModel({
		NISS: patientNiss,
		studyDate: formattedDate,
		imageType: 'Xray',
		studyType: 'Mammographie',
		isValid: true
	});

	//Get the studyId so it can be returned, to store with the image information
	var studyId = study._id;

	console.log('Study schema: ' + study);
	
	study.save(function(err){
        return callback(err, studyId);
    });
	

};