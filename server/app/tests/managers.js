var assert          = require('assert');
var should          = require('should');
var request         = require('supertest');
var patientManager  = require('../managers/patient_manager');
var imageManager    = require('../managers/image_manager');
var userManager     = require('../managers/user_manager');
var studyManager    = require('../managers/study_manager');
var Study           = require('../databases/studies.json');
var User            = require('../databases/tests/user.json');
var app             = require('../../app.js');

var token;
var user = {};

describe('Services', function() {
    describe('Patient Manager', function(){
        describe('#list()', function(){
            //var list = patientManager.list();

            it('Should return a full list of patients with no double', function(done){
                patientManager.list(function (code, result) {/*
                    console.log(result);*/
                    assert.equal(2, result.length);
                    done();
                });
            });
            it('Each patient has a expected value', function(done) {
                patientManager.list(function (code, result) {
                    result[0].should.have.property('NISS', '61030151814');
                    result[0].should.have.property('name', 'Jane Doe');
                    result[0].should.have.property('birthdate', '01/03/1961');    

                    result[1].should.have.property('NISS', '80051251021');
                    result[1].should.have.property('name', 'John Doe');
                    result[1].should.have.property('birthdate', '12/05/1980');
                    done();
                });
            })
        })
    })

/*    describe('Image Manager', function(){
        describe('#list()', function(){
            it('Should return a list with all images', function(done){
                imageManager.list(function (code, result) {
                    assert.equal(6, result.images.length);
                    done();
                });
            })
        })
        
        describe('#getImagesInfo(path, callback)', function() {
//            before(function(done) {
//                // Create dicomTest
//                done();
//                
//            });
//            
//            after(function(done) {
//                
//                done();
//            }); 
            it('Should return a list with all images', function(done){
                var img_path        = '../../../patients/img/';
                
                
                imageManager.getImagesInfo("BILATERAL_700", function (code, result) {
                    
                    console.log(result);
                   
                    var patient = result.patient;
                    patient.should.have.property("studyDate", "");
                    patient.should.have.property("studyID", "");
                    patient.should.have.property("images", "");
                    patient.should.have.property("path", "");
                    patient.should.have.property("key", "");
                    patient.should.have.property("patientName", "");
                    patient.should.have.property("patientID", "");
                    patient.should.have.property("birthdate", "");
                    patient.should.have.property("study", "");
                    patient.should.have.property("birthdate", "");
                    done();
                });
            });
        });
    });*/

    describe('Study Manager', function(){
        describe('#listRelevantByPatient(user, patientId)', function(){
            it('Should return a list of studies that have a relevant modality for the user for a given patient', function(done){
                studyManager.listRelevantByPatient(User, "61030151814", function (code, result) {
                    assert.equal(1, result.length);   
                    done();
                });
            });
            it('Return an empty array if patientId doesn\'t exist', function(done){
                studyManager.listRelevantByPatient(User, "", function (code, result) {
                    assert.equal(0, result.length);   
                    done();
                });
            });
        });
        
        describe('#getAllTypes()', function(){
            it('Should return the distinct list of the modality of images', function(done) {
                studyManager.getAllTypes(function(code, result) {
                    result[0].should.equal('Xray');
                    result[1].should.equal('CAT');
                    result[2].should.equal('MRI');
                    result.should.have.length(3);
                    done();
                });
            });
        });
    });
    
    

    describe('User Manager', function() {
        describe('#getInformation(token)', function() {
            before(function(done) {
                request(app)
                    .post('/api/signin')
                    .send({ username: 'etienne', 
                            password: 'pass',
                            relevantTypes: [
                                {
                                    type: "Xray",
                                    relevant: false
                                }, 
                                {
                                    type: "CAT",
                                    relevant: true
                                },
                                {
                                    type: "MRI", 
                                    relevant: true
                                }]
                          })
                    .expect(200)
                    .end(function(err, res) {
                        token = res.body.token; // Or something
                        done();
                    });
            });

            after(function(done){
                request(app)
                    .post('/api/signout')
                    .send({ user: 'etienne' })
                    .expect(200)
                    .end(function(err, res) {
                        token = res.body.token; 
                        done();
                });
            });
            it('should return user information', function(done) {
                userManager.getInformation(token, function(code, result) {
                    assert.equal(200, code);
                    
                    done();
                });
                
            });
            
        });
        
        
    })
})



