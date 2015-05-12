var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

// Relevant types schema
var relevantType = new Schema({
    type: {type: String, required: true},
    relevant: {type: Boolean, required: true}
});

// User schema
var User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], required: true },
    created: { type: Date, default: Date.now },
    relevantTypes: [relevantType]
});

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
    var user = this;
    
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};


//Define Models
var userModel = mongoose.model('User', User);
var relevantType = mongoose.model('RelevantType', relevantType);


// Export Models
exports.userModel = userModel;
exports.relevantType = relevantType;