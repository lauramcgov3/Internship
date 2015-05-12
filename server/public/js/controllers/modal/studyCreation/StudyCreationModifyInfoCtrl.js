angular.module('StudyCreationModifyInfoCtrl', []).controller('StudyCreationModifyInfoController', ['$scope', '$modalInstance', 'Study', 'Upload', 'studyImages', 'FileTransferUtils', function($scope, $modalInstance, Study, Upload, studyImages, FileTransferUtils) {

    $scope.transferDICOMToJS= function(){
        
        var setDicomObject = function(base64){
            var byteArray = FileTransferUtils.base64ToBigByteArray(base64);   
            try
            {
               // Parse the byte array to get a DataSet object that has the parsed contents
                var dataSet = dicomParser.parseDicom(byteArray);
                $scope.dicomInfos = dicomParser.explicitDataSetToJS(dataSet);
            }
            catch(ex)
            {
               console.log('Error parsing byte stream' - ex);
            }
        }
        
        var byteArray = FileTransferUtils.fileToBase64(studyImages[0], setDicomObject);
    }
    
    $scope.transferDICOMToFiles = function(){
        
        for(var i = 0; i < studyImages.length; i++){
            var setDicomObject = function(base64){
                var byteArray = FileTransferUtils.base64ToBigByteArray(base64);   
                try
                {
                   // Parse the byte array to get a DataSet object that has the parsed contents
                    var dataSet = dicomParser.parseDicom(byteArray);
                    
                     // access a string element
                    var sopInstanceUid = dataSet.string('x0020000d');

                    // get the pixel data element (contains the offset and length of the data)
                    var pixelDataElement = dataSet.elements.x7fe00010;
                    
                    debugger;
                    
                    // create a typed array on the pixel data (this example assumes 16 bit unsigned data)
                    var pixelData = new Uint8Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
                    debugger;
                    
                    var blob = new Blob([pixelData]);
//                         var reader = new window.FileReader();
//                         reader.readAsDataURL(blob); 
//                         reader.onloadend = function() {
//                                        base64data = reader.result;                
//                                        window.open(base64data);
//                          }
                    

                }
                catch(ex)
                {
                   console.log('Error parsing byte stream' - ex);
                }
            }

            var byteArray = FileTransferUtils.fileToBase64(studyImages[i], setDicomObject);
        }
    }
    
    //Creates the study
    $scope.createStudy = function(){
        Study.create($scope.patient.NISS)
        .success(function (studyId) {
            console.log('Uploading');
            for (var i = 0; i < $scope.filesToUpload.length; i++) {
                Upload.uploadFiles(studyId, {
                    files: $scope.filesToUpload[i]
                });
            }
            Image.create(studyId);

        }).error(function () {
            console.log('error');
        });
    }
    
    $scope.init = function(){
        $scope.transferDICOMToJS();
        $scope.transferDICOMToFiles();
    }
    $scope.init();
    
    //CLOSE MANAGEMENT
    $scope.close = function(){
        $modalInstance.close();
    }
    
    //To close the popup on any page change
    $scope.$on('$locationChangeStart', function(event) {
        $scope.close();
    });
    
    window.addEventListener("unload", function(){
        $scope.close();
    });
    //END To close the popup on any page change
    //END CLOSE MANAGEMENT
}]);
