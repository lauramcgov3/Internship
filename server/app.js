var express      = require('express');
var http         = require('http');
var fs           = require('fs');
var nconf        = require('nconf');
var app          = express();
var audit        = require('./app/audit-log');
var bodyParser 	 = require ('body-parser');


// Audit-log
audit.addTransport("mongoose", {connectionString: "mongodb://localhost:27017/medicalstudio", debug:false});

// NodeJS server config
verifyConfig();


function verifyConfig(){
    if (!fs.existsSync('config')) {
        fs.mkdirSync('config');
    }
    fs.exists('config/server.json', function(exists) {
        if (!exists) {
            createDefaultConfigFile();
        }
        else{
            var configFileChanged = false;
            nconf.file('config/server.json');

            if (typeof nconf.get('server') === "undefined"){
                setDefaultConfigFile('server', function (err, result){
                    configFileChanged = result;
                });
            }
            if (typeof nconf.get('token') === "undefined"){
                setDefaultConfigFile('token', function (err, result){
                    configFileChanged = result;
                });
            }
            if (typeof nconf.get('redis') === "undefined"){
                setDefaultConfigFile('redis', function (err, result){
                    configFileChanged = result;
                });
            }
            if (typeof nconf.get('log') === "undefined"){
                setDefaultConfigFile('log', function (err, result){
                    configFileChanged = result;
                });
            }
            if (configFileChanged){
                nconf.save(function (err) {
                    fs.readFile('config/server.json', function (err, data) {
                        run();
                    });
                });
            }
            else{
                run();
            }
        }
    });
}

function createDefaultConfigFile(configName, callback) {
    
    nconf.argv().env().file({ file: 'config/server.json' });
    //Server
    nconf.set('server:ipAddress', '127.0.0.1');
    nconf.set('server:port', 3002);
    
    //Token
    nconf.set('token:secret', 'p0@(2eax=@)c)%vb%h@ew%=2=eund^i)^hzue#=0o4eeh%)(i$');
    nconf.set('token:expiration', 60);
    
    //Redis
    nconf.set('redis:port', 6379);
    
    //Logs path
    nconf.set('log:path', '/tmp/medicalstudio/');
    
    // Save the configuration object to disk
    nconf.save(function (err) {
        fs.readFile('config/server.json', function (err, data) {
            run();
        });
    });
}

function setDefaultConfigFile(configName, callback) {
    
    if (configName == 'server'){
        nconf.set('server:ipAddress', '127.0.0.1');
        nconf.set('server:port', 3002);
        callback(null, true);
    }
    else if (configName == 'token'){
        nconf.set('token:secret', 'p0@(2eax=@)c)%vb%h@ew%=2=eund^i)^hzue#=0o4eeh%)(i$');
        nconf.set('token:expiration', 60);
        callback(null, true);
    }
    else if (configName == 'redis'){
        nconf.set('redis:port', 6379);
        callback(null, true);
    }
    else if (configName == 'log') {
        nconf.set('log:path', '/tmp/medicalstudio/');
        callback(null, true);
    }
    else{
        callback(null, false);
    }
}

function run() {
    // Express config
    nconf.file('config/server.json');
    app.configure(function() {
        app.set('port', nconf.get('server').port);
        app.use(express.static(__dirname + '/public'));
        app.use(express.json({strict: true}));
        app.use(express.methodOverride());
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(express.bodyParser({uploadDir:'./images'}));
		app.use(bodyParser.json());
		console.log('Running');
    });
    
    // MongoDB
    require('./app/databases/mongodb');
    // Routes
    require('./app/routes')(app);

    // Start NodeJS server
    nconf.file('config/server.json');
    
    http.createServer(app).listen(nconf.get('server').port);
    
    // Must be required here to let mongodb.js the time to require log.
    var log = require('./app/log');
    
    log.info('Server started on port ' + nconf.get('server').port);
    
    audit.logEvent('[app]', 'main app', 'Start', 'Port', nconf.get('server').port, 'succeed', 'Server successfully started.');
    
    // Create web api 
    exports = module.exports = app;

};

module.exports = app;

