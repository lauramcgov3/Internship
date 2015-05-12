var jsonwebtoken    = require('jsonwebtoken');
var nconf           = require('nconf');nconf.file("config/server.json");
var secret          = nconf.get('token').secret;
var db              = require('../models/user');
var redisClient     = require('../databases/redis').redisClient;
var tokenManager    = require('../managers/token_manager');
var audit           = require('../audit-log');
var userRepo        = require('../repositories/user_repository');

// ========================================================
/**
* Connect a user on the site
* @param username {} 
* @param password {}
* @param expiration {}
* callback {}
*/
exports.signIn = function(username, password, expiration, callback) {
    if (username == '' || password == '') {
        audit.logEvent('[anonymous]', 'Users ctrl', 'Sign in', '', '', 'failed',
                       'The user tried to sign in but one or more params of the request was not defined');
		return callback(400,null); 
	}
    else {
        db.userModel.findOne({username: username}, function (err, user) {
            if (err) {
                console.log(err);
                audit.logEvent('[mongodb]', 'Users ctrl', 'Sign in', 'used username', username, 'failed', 'Mongodb attempted to find the username');
                return callback(401, null);
            }
            else if (user == undefined) {
                audit.logEvent('[anonymous]', 'Users ctrl', 'Sign in', 'used username', username, 'failed', 
                               'The user tried to sign in but the used username does not exist');
                return callback(401, null);
            }
            else {
                user.comparePassword(password, function(isMatch) {
                    if (!isMatch) {
                        audit.logEvent(user.username, 'Users ctrl', 'Sign in', 'used username', username, 'failed',
                                       'The user tried to sign in but the password was incorrect');
                        callback(401, null);
                    }
                    var token = jsonwebtoken.sign({id: user._id}, secret, { expiresInMinutes: expiration });
                    audit.logEvent(user.username, 'Users ctrl', 'Sign in', 'used username', username, 'succeed',
                                   'The user has successfully signed in to his account');
                     return callback(200, token);
                });
             }
        });  
    }
}

// ========================================================
exports.signUp = function(username, password, passwordConfirmation, roles, types, callback) {
	if (username == '' || password == '' || password != passwordConfirmation || roles == '' || types == '') {
        audit.logEvent('[anonymous]', 'Users ctrl', 'Sign up', '', '', 'failed',
                       'The user could not register because one or more params of the request was not defined');
        return callback(400, null);	}                                                                                                                                                                             
	var user = new db.userModel();
	user.username = username;
	user.password = password;
    user.roles = roles;
    
    var userTypes = [];
    types.forEach(function(type) {
        var relevantType = new db.relevantType();
        relevantType.type = type.type;
        relevantType.relevant = type.relevant;
        userTypes.push(relevantType);
    });
    
    user.relevantTypes = userTypes;

	user.save(function(err) {
        if (err) {
			console.log(err);
            audit.logEvent('[mongodb]', 'Users ctrl', 'Sign up', "username", user.username, 'failed', "Mongodb attempted to save the new user");
			return callback(500, null);
		}
        audit.logEvent(user.username, 'Users ctrl', 'Sign up', 'user role', user.roles, 'succeed',
                       'The user has successfully created an account');
        return callback(200, null);    
	});
 };
 
// ========================================================
exports.signOut = function(user, callback) {
    if (!user) {
        audit.logEvent('[anonymous]', 'Users ctrl', 'Sign out', '', '', 'failed',
                       'The user could not log out because one or more params of the request was not defined');
        return callback(500, null);
	}
	else {
        delete user;
        audit.logEvent('[anonymous]', 'Users ctrl', 'Sign out', '', '', 'succeed',
                       'A user has successfully log out');
		return callback(200, null);
	}    
 };

exports.getInformation = function(actorID, callback) {
    userRepo.getInformation(actorID, function(err, result) {
        if (err) {
            return callback(500, err);
        }
        return callback(200, result);
    });
};

exports.update = function(actorID, types, next) {        
    var userTypes = [];
    types.forEach(function(type) {
        var relevantType = new db.relevantType();
        relevantType.type = type.type;
        relevantType.relevant = type.relevant;
        userTypes.push(relevantType);
    });

    db.userModel.update({
        _id: actorID
    }, {
        relevantTypes: userTypes
    }, function(err, user) {
        if (err) {
            console.log(err);
            audit.logEvent('[mongodb]', 'Users ctrl', 'Update', 'user relevant types', types, 'failed', 'Mongodb attempted to update the relevant types of the user');
            next(401, null);
        }
        audit.logEvent(user.username, 'Users ctrl', 'Update', 'user relevant types', types, 'succeed',
                   'The user has successfully been updated');
        next(200, null);
    });     
};
    
