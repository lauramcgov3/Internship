var assert          = require('assert');
var should          = require('should');
var util            = require('util');
var patients        = require('../data/patients.json');
var proxyquire      =  require('proxyquire');
var pathStub        =  { };
    
    describe('Patient Manager', function(){
        describe('#list(callback)', function(){      
            it('should return a list with all patients', function(done){              
                pathStub.list = function (callback) { return callback(null, patients); };
                var patientManager = proxyquire('../../managers/patient_manager', { '../repositories/patient_repository': pathStub });
                patientManager.list(function(err, result) {
                    assert.equal(patients, result);
                    done(); 
                });
            });
        });
    });