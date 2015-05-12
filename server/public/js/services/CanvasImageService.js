angular.module('CanvasImageService', []).factory('CanvasImage', ['$http', '$window', '$timeout', 'Screen', 'FileTransferUtils', '$routeParams', function($http, $window, $timeout, Screen, FileTransferUtils, $routeParams) {
    
    var stagesToBeSaved = [];
    var timer = null;
    
    /** 
    * Initialize or reinitialize a timer that will be used to lanch a saving function une minute later.
    */
    var updateTimer = function(){
        if (timer) {
            $timeout.cancel(timer)
        }
        timer = $timeout(saveAllModifiedStages, 1000 * 10);  // 1000 = 1 second
    }
    
    /** 
    * Add a stage to the modified stage list and starts or reninitialize a 1 minute timer before to save images.
    * @param stage {Stage} Modified stage
    */
    var stageModified = function(stage) {
        
        updateTimer();
        
        var stageInArray = $.grep(stagesToBeSaved, function(e){ return e.id == stage._id; });
        
        //It is already present
        if(stageInArray.length > 0)
        {
            stageInArray[0].stage = stage;
        }
        //It is not there so we add it
        else{
            
            var newStage = {
                id: stage._id,
                studyId: $routeParams.id,
                stage: stage
            };
            
            stagesToBeSaved.push(newStage);
        }
    }
    
    /**
    * TODO
    * Saves a screenshot of the stage (or maybe it should add it to the array and be saved at the same moment as the others)
    * @param stage {Stage} Modified stage
    */
    var stageScreenshot = function(stage, x, y, height, width) {
        
//        var stageInArray = $.grep(stagesToBeSaved, function(e){ return e.id == stage._id; });
//        
//        //It is already present
//        if(stageInArray.length > 0)
//        {
//            stageInArray[0].stage = stage;
//        }
//        //It is not there so we add it
//        else{
//            
//            var newStage = {
//                id: stage._id,
//                stage: stage
//            };
//            
//            stagesToBeSaved.push(newStage);
//        }
    }
    
    /** 
    * Save all modified stages as images
    * @param stages {[Stage]} Stages to be saved
    */
    var saveStagesAsImages = function(stages) {
        
        for(var i = 0; i < stages.length; i++){
            
            var currentStage = stages[i];
            
            //We set the configs for the toImage function
            //Might be moved as a function out of here
            var config = {
                callback: function(dataUrl)
                {
                    
                    console.log('saving file');
                    var file = FileTransferUtils.base64ToBlob(dataUrl);

                    Screen.saveStageImage(currentStage.studyId, file)
                    .success(function(result){
                                  console.log('SUCCESS');
                    })
                    .error(function(err){
                        console.log("ERROR");
                    });
                }
            }
            
            var fileStage = currentStage.stage.toDataURL(config);
            
        }        
    }
    
    /** 
    * Save all modified stages as images after a minute. 
    */
    var saveAllModifiedStages = function()
    {
        //We copy it in order to make sure that there are no data collisions and that the being saved array doesn't change during the save.
        var modStages = stagesToBeSaved.slice(0);
        
        stagesToBeSaved = [];
        saveStagesAsImages(modStages);
    }
    
    return {
        stageModified: stageModified,
        stageScreenshot: stageScreenshot
    }
}]);