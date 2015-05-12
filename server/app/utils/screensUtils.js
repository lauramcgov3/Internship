/**
* Used in the report PDF creation. It filters the screen in the HTMl to get the right path.
* If no screen is found, it returns the URL to the default template image.
* @param res {Response} HTTP response 
* @param code {Int} Status code 
* @param result {Object} A JSON object to return to the client (an error object if an error occured)
*/ 
exports.screenFilter = function(screens, laterality, position){
    for(var i = 0; i < screens.length; i++){

        var curScreen = screens[i];
        if(curScreen.laterality === laterality && curScreen.position === position){
            return curScreen;
        }
    }
     
    return {path:"images/studiesScreens/default.jpg"};
}