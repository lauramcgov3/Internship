var jsonwebtoken    = require('jsonwebtoken');
var nconf           = require('nconf');nconf.file("config/server.json");
var secret          = nconf.get('token').secret;
var db              = require('../../models/user');
var redisClient     = require('../../databases/redis').redisClient;
var tokenManager    = require('../../managers/token_manager');
var audit           = require('../../audit-log');
var userManager     = require('../../managers/user_manager');
var utils           = require('../../utils/utils');

// ========================================================
exports.signIn = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
    var expiration = tokenManager.TOKEN_EXPIRATION;
    
    if(req.body.rememberme){
        expiration = 1000 * 60 * 24 * 7;
    }
      
    userManager.signIn(username, password, expiration, function (code, token) {
        if (code && code != 200)  {
            return res.send(code);
        }
        return res.json({token:token});
    });
};

// ========================================================
exports.signUp = function(req, res) {
    console.log("controllerSignUp");
	var username = req.body.username || '';
	var password = req.body.password || '';
	var passwordConfirmation = req.body.passwordConfirmation || '';
    var roles = req.body.roles || '';
    var types = req.body.types || '';
    
    userManager.signUp(username, password, passwordConfirmation, roles, types, function (code) {
        return res.send(code);
    });
};

// ========================================================
exports.signOut = function(req, res) {
    var user = req.user;
     userManager.signOut(user, function (code) {
         if (code && code != 200) {
            tokenManager.expireToken(req.headers);
        }
        return res.send(code);
     });
};

// ========================================================
exports.getInformation = function(req, res) {
    var token = tokenManager.getToken(req.headers);
    if (token == null) {
       audit.logEvent('[anonymous]', 'Users ctrl', 'Get information', '', '', 'failed',
                       'The user was not authenticated');
        next(401, null);
    } else {
        var actorID = jsonwebtoken.decode(token).id;
        
        userManager.getInformation(actorID, function(code, result){
            return utils.defaultResponse(res,code,result);
        });
    }
};

// ========================================================
exports.update = function(req, res) {
    var types = req.body.relevantTypes || '';
    var token = tokenManager.getToken(req.headers);
    
    if (token == null) {
       audit.logEvent('[anonymous]', 'Users ctrl', 'Update', '', '', 'failed',
                       'The user was not authenticated');
        return callback(401, null);
    } else {
        var actorID = jsonwebtoken.decode(token).id;
        
        userManager.update(actorID, types, function(code, result) {
            return utils.defaultResponse(res,code,result);
        });
    }
};
