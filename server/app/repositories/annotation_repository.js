var mongoose    = require('mongoose');
var Schema = mongoose.Schema;

var annotationSchema = new Schema({
    image_id : String,
    message : String,
    points : Array,
    type : String,
    isVisible : Boolean,
    attrs: Object

});
var Annotation = mongoose.model('Annotation', annotationSchema);

//================================================================
module.exports.getAllByImage = function(imageId, callback) {
     Annotation.where({ image_id: imageId }).exec(callback);
};

//================================================================
module.exports.save = function(annotationSended, callback) {
    var annotation = new Annotation(annotationSended);
    // Update
    Annotation.findOne({ _id: annotationSended._id }, function (err, doc){
        if (doc != null) {
            var conditions = { _id: annotationSended._id }
            ,update = { 
                message: annotationSended.message,
                points: annotationSended.points,
                type: annotationSended.type,
                isVisible: annotationSended.isVisible,
                attrs : annotationSended.attrs
            }
            Annotation.update(conditions, update, {}, function(err, numAffected) {
                if (err) return callback(err, null);
                return callback(null, numAffected);
            })
        }
        // Insert
        else {
//            console.log("insert");
            annotation.save(function (err) {
                if (err) return callback(err, null);
                return callback(null, annotation);
            });
        }
    });
                       
};

//================================================================
module.exports.delete = function(id, callback) {
    Annotation.remove({_id : id}).exec(callback);   
    
};


//================================================================
module.exports.deleteAllByImage = function(imageId, callback) {
    Annotation.remove({ image_id : imageId }, function (err) {
        if (err) return callback(err, null);
        return callback(null);
    });
};