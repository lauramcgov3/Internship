var redis = require('redis');
var nconf = require('nconf');
nconf.file("config/server.json");
var log   = require('../log');


var redisClient = redis.createClient(nconf.get('redis').port);
redisClient.on('error', function (err) {
    log.error(err);
});

redisClient.on('connect', function () {
    log.info('Redis is ready');
});

exports.redis = redis;
exports.redisClient = redisClient;