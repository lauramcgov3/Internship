var mongoose = require('mongoose');

// ========================================================
var imageSchema = new mongoose.Schema({
	studyNum: {type: String, required: true},
	imagePath: {type: String, required: true}, //The path to where the image is stored
	laterality: {type: String, required: true},
	position: {type: String, required: true}
});

// ========================================================
imageSchema.statics.findAll = function (cb) {
    this.find(cb);
};

var imageModel = mongoose.model('Image', imageSchema);

exports.imageModel = imageModel;