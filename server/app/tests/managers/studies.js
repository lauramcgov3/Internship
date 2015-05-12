var assert          = require('assert');
var should          = require('should');
var util            = require('util');
var studies          = require('../data/studies.json');
var proxyquire      =  require('proxyquire');
var pathStub        =  { };    

describe('Studies Manager', function(){
    describe('#listRelevantByPatient(user, patientId, callback)', function(){
        it('should return a list with relevant studies', function(done){
            var user = "Jane Doe";
            var patientId = "61030151814";
            pathStub.listRelevantByPatient = function(user, patientId, callback) { return callback(null, studies); };
                var studyManager = proxyquire('../../managers/study_manager', { '../repositories/study_repository': pathStub });
                studyManager.getRelevantByPatient(user, patientId, function(err, result) {
                    assert.equal(studies, result);
                    done(); 
            });
        });   
    });
    
    describe('#getAllTypes(callback)', function(){
        it('should return a list with relevant studies', function(done){
            var user = "Jane Doe";
            var patientId = "61030151814";
            pathStub.getAllTypes = function(callback) { return callback(null, studies); };
                var studyManager = proxyquire('../../managers/study_manager', { '../repositories/study_repository': pathStub });
                studyManager.getAllTypes(function(err, result) {
                    assert.equal(studies, result);
                    done(); 
            });
        });
    });
});