var log         = require('../log');
/**
* Used to return simple HTTP answers. If you have a code, it will send
* it to the client. If you have a code and a result, it will send both.
* @param res {Response} HTTP response 
* @param code {Int} Status code 
* @param result {Object} A JSON object to return to the client (an error object if an error occured)
*/
exports.defaultResponse = function(res, code, result) {
    //We don't have a code or a result. It's not supposed to happen.
    if (!code && !result) {
        console.log("We don't return any code or result");
        return res.send(500);
    }
    else{ 
        
        //If it's an error, we log it
        if (code !== 200) {
            log.error(result);
        }
        
        //We return the result only if there is one. Otherwise, we send the code alone.
        if(result)
        {
            return res.status(code).json(result);
        }
        else
        {
            return res.send(code);
        }
    }        
};