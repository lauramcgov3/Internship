var assert          = require('assert');
var should          = require('should');
var util            = require('util');
var images          = require('../data/images.json');
var proxyquire      =  require('proxyquire');
var pathStub        =  {};    

describe('Image Manager', function(){
    describe('#list(callback)', function(){
        it('should return a list with all images', function(done){
            pathStub.list = function (callback) { return callback(null, images); };
                var imageManager = proxyquire('../../managers/image_manager', { '../repositories/image_repository': pathStub });
                imageManager.list(function(err, result) {
                    assert.equal(images, result);
                    done(); 
            });
        });
    });
    
    describe('#getByStudy(callback)', function(){
    it('should return a list with all images', function(done){
        pathStub.list = function (callback) { return callback(null, images); };
            var imageManager = proxyquire('../../managers/image_manager', { '../repositories/image_repository': pathStub });
            imageManager.list(function(err, result) {
                assert.equal(images, result);
                done(); 
        });
    });
});
});


