/**
* Report Basic Model
*/

var mongoose = require('mongoose');

// Report Basic schema
var Schema = mongoose.Schema;
var RptBasic = new Schema({
    userID: { type: String, required: true },
    patientID: { type: String, required: true },
    patientName: { type: String, required: false },
    patientBirthdate: { type: String, required: false },
    studyID: { type: String, required: true},
    image: { type: String, required: true},
    techQuality: { type: String, required: false},
    causes : {type: Array, required: false},
    comments : { type: String, required: false},
    createdOn: { type: Date, default: Date.now },
    checked: {type: Boolean, required: false, default: false }
});


// Define Model
var rptBasicModel = mongoose.model('RptBasic', RptBasic);

// Export Model
exports.rptBasicModel = rptBasicModel;