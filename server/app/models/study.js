var mongoose = require('mongoose');

// ========================================================
var studySchema = new mongoose.Schema({
	NISS: {type: Number, required: true},
	studyDate: {type: String, required: true},
	imageType: {type: String, required: true},
	studyType: {type: String, required: true},
	isValid: {type: Boolean, required: true}
});

// ========================================================
studySchema.statics.findAll = function (cb) {
    this.find(cb);
};

var studyModel = mongoose.model('Study', studySchema);

exports.studyModel = studyModel;