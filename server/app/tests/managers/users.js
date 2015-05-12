var assert          = require('assert');
var should          = require('should');
var util            = require('util');
var imageManager    = require('../../managers/image_manager');
var studyManager    = require('../../managers/study_manager');
var patients        = require('../data/patients.json');
var proxyquire      =  require('proxyquire');
var pathStub        =  { };    
    

describe('Study Manager', function(){
    describe('#listRelevantByPatient(patientId)', function(){
        it('Should return a list of studies for a given patient', function(done){
            studyManager.listRelevantByPatient("61030151814", function (code, result) {
                assert.equal(2, result.length);   
                done();
            });
        });
        it('Return an empty array if patientId doesn\'t exist', function(done){
            studyManager.listRelevantByPatient("", function (code, result) {
                assert.equal(0, result.length);   
                done();
            });
        });
    });
});

