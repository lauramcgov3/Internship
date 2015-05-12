angular.module('UploadCtrl', []).controller('UploadController', ['$scope', 'Upload', 'Study', 'Image', '$modal',
function ($scope, Upload, Study, Image, $modal) {

		$scope.filesToUpload = []; //Array to contain images to be uploaded.

		//Upload file function

		$scope.uploadFile = function () {
			Study.create($scope.patient.NISS)
				.success(function (studyId) {
					console.log('Uploading');
					for (var i = 0; i < $scope.filesToUpload.length; i++) {
						Upload.uploadFiles(studyId, {
							files: $scope.filesToUpload[i]
						});
					}
					Image.create(studyId);
					//console.log(imageId);

			});
		};

}]);
	
	/*$scope.uploadFile = function () {    
            var modalInstance = $modal.open({
                templateUrl: '/views/modal/studyCreation/studyCreationModifyInfo.html',
                controller: 'StudyCreationModifyInfoController',
                windowClass: 'ModifyInfoPopup',
                resolve: {
                    studyImages: function(){
                        return $scope.filesToUpload;
                    }
                }
            });

            modalInstance.result.then(function () {
            });        
	
		};*/