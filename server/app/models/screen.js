/**
* Screen Model
*/

var mongoose = require('mongoose');

// Screen schema
var Schema = mongoose.Schema;
var Screen = new Schema({
    studyId: { type: String, required: true},
    position: { type: String, required: false},
    laterality: { type: String, required: false},
    path : {type: String, required: true},
    isValid : { type: Boolean, required: true}
});


// Define Model
var screenModel = mongoose.model('Screen', Screen);

// Export Model
exports.screenModel = screenModel;