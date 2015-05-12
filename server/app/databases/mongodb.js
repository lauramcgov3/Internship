var mongoose        = require('mongoose');
var log             = require('../log');
var mongodbURL      = 'mongodb://172.31.6.252/medicalstudio';
var mongodbOptions  = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        log.info('Connection refused to ' + mongodbURL);
        log.error(err);
    } else {
        log.info('MongoDB is ready');
    }
});