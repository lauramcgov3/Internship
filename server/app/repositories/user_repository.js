var db              = require('../models/user');
var audit           = require('../audit-log');

// ======================================================
module.exports.getInformation = function(userID, callback) {
    db.userModel.findById(userID, function(err, user) {
        if (err) {
            audit.logEvent('[mongodb]', 'Users ctrl', 'Get information', 'user id', userID, 'failed', 'Mongodb attempted to find the id');
            return callback(err, null);
        }
        return callback(null, user)
    });   
}