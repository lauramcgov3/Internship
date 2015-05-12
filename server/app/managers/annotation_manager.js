var annotationRepository     = require('../repositories/annotation_repository');

//================================================================
exports.getAllByImage = function(imageId, callback) {
        annotationRepository.getAllByImage(imageId, function (err, annotations) {
            if (err) {
                return callback(500, err);   
            }
            return callback(200, annotations);               
        });
};

//================================================================
exports.save = function(annotation, callback) {
    annotationRepository.save(annotation, function (err, annotationRecu) {
        if (err) {
            return callback(500, err);   
        }
        return callback(200, annotationRecu);             
    });
};

//================================================================
exports.delete = function(id, callback) {
    annotationRepository.delete(id, function (err) {
        if (err) {
            return callback(500, err);   
        }
        return callback(200);              
    });
};

//================================================================
exports.deleteAllByImage = function(imageId, callback) {
    annotationRepository.deleteAllByImage(imageId, function (err) {
        if (err) {
            return callback(500, err);   
        }
        return callback(200);               
    });
};