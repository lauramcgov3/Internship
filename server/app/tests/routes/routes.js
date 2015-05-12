var assert          = require('assert');
var should          = require('should');
var request         = require('supertest')
var app             = require('../../../app.js');
    
var token = null;

describe('Rest API Connected', function() {
    beforeEach(function(done) {
        request(app)
            .post('/api/signin')
            .send({ username: 'etienne', password: 'pass' })
            .expect(200)
            .end(function(err, res) {
                token = res.body.token; // Or something
                done();
            });
    });
    
    afterEach(function(done){
        request(app)
            .post('/api/signout')
            .send({ user: 'etienne' })
            .expect(200)
            .end(function(err, res) {
                token = res.body.token; 
                done();
        });
    })
    
    describe('GET /api/patients', function(){
        it('respond with json', function(){
            request(app)
                .get('/api/patients')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(200);
        })
    })
    
    describe('GET /api/patient/:id', function(){
        it('respond with json', function(){
            request(app)
                .get('/api/patient/:id')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(200);
        })
    })
    
    describe('PUT /api/user/:id', function(){
        it('send 200 after UPDATING the user', function(done){
            request(app)
                .put('/api/user/2')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        })
    })
    describe('GET /api/user/', function(){
        it('respond with json', function(){
            request(app)
                .get('/api/user/')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(200);
        })
    })
    
    describe('GET /api/types/', function(){
        it('respond with json', function(){
            request(app)
                .get('/api/types/')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(200);
        })
    })
    
/*    describe('PUT /api/user/', function(){
        it('should UPDATE the user and send 200', function(done){
            request(app)
                .put('/api/user/')
                .set('Authorization', 'Bearer ' + token)
                .expect(200, done);
        })
    })*/
    
    //    describe('GET /api/images', function(){
//        it('respond with json', function(done){
//            request(app)
//                .get('/api/images')
//                .set('Accept', 'application/json')
//                .set('Authorization', 'Bearer ' + token)
//                .expect('Content-Type', /json/)
//                .expect(200, done);
//            })
//    })
  });
