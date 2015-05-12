var uploadRepository = require('../repositories/upload_repository');
var imageRepository  = require('../repositories/image_repository');
var mkdirp = require('mkdirp');
var path = require('path');
//var uploadPath = path.resolve(__dirname + '/../../images/studies/');
var rootPath = path.resolve(__dirname + '/../../');
var uploadPath = rootPath + '/images/studies/';
var fs = require('fs');

exports.getFiles = function (files, body, callback) {
	uploadRepository.getFiles(files, function (err, files) {
		if (err) {
			return callback(500, err); //If error, send back 500 code and the error
		}
		return callback(200, files); //If success, send back 200 code and files object
	});
};

exports.postFiles = function (files, body, studyId, callback) {
	uploadRepository.postFiles(studyId, files, function (err, filePath) {
		if (err) {
			return callback(500, err); //If error, send back 500 code and the error
		}
		
		//Old file path
		oldPath = rootPath +'/' + files.file.path;
		console.log('Old save path: ' + oldPath);
        
		//We define the new path of the file
        var path = uploadPath + studyId;
		console.log('New save path: ' + path);
		
        
        //Creation of the study folder
        mkdirp(path, function(err) { 
			
			var fileMoveFunction = function(source, dest){
				console.log('Upload manager: ' + dest);
                moveFile(source, dest, function(err){
                    if(err){
                        return callback(500, err);
                    }
                    return callback(200);
                });
            };
          
			
			if(err){
                callback(500, err);
            }
            
           if(files)
            {
                var source = oldPath;
                var dest = path + '/' + files.file.path.split("/").pop();
                console.log("Source : " + source);
                console.log("Dest : " + dest);
//                console.log(files);
                return fileMoveFunction(source, dest);
//                return fileMoveFunction(uploadPath + "/../../" + files.file.path);
            }

        });  
		
		return callback(200, files); //If success, send back 200 code and files object
	});
};

function moveFile(source, target, callback) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", done);

  var wr = fs.createWriteStream(target);
  wr.on("error", done);
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
        fs.unlink(source, function(){
            callback(err);
        });
      
      cbCalled = true;
    }
  }
}


