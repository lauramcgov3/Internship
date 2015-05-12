var jwt          = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');
var fs           = require('fs');
var _            = require('underscore');
var tokenManager = require('./managers/token_manager');
var nconf        = require('nconf');nconf.file("config/server.json");
var secret       = nconf.get('token').secret;
var db           = require('./models/user');
var aclRoutes    = require('./acl/routes.json');
var aclRoles     = require('./acl/roles.json');





// Controllers


var controllers = {};
controllers.reports         = require('./controllers/generic/reports');
controllers.images          = require('./controllers/generic/images');
controllers.patients        = require('./controllers/generic/patients');
controllers.studies         = require('./controllers/generic/studies');
controllers.annotations     = require('./controllers/generic/annotations');
controllers.users           = require('./controllers/generic/users');
controllers.uploads         = require('./controllers/generic/uploads');
controllers.screens         = require('./controllers/generic/screens');
controllers.angular         = function(req, res) {res.sendfile('./public/index.html');};

//Routes
var routes = [
    
    //Next: 26
    // API ROUTES ===============================================================
    // === USERS ROUTES ========================================================
    // Create a new user
    {
        path: _.findWhere(aclRoutes, {id: 1}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 1}).method,
        middleware: [controllers.users.signUp]
    },
    
    // Log in
    {
        path: _.findWhere(aclRoutes, {id: 2}).uri,  
        httpMethod: _.findWhere(aclRoutes, {id: 2}).method,
        middleware: [controllers.users.signIn]
    },

    // Log out
    {
        path: _.findWhere(aclRoutes, {id: 3}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 3}).method,
        middleware: [jwt({secret: secret}), controllers.users.signOut]
    },
    
    // Get information
    {
        path: _.findWhere(aclRoutes, {id: 7}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 7}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.users.getInformation]
    }, 
    
    // Update user's relevant types
    {
        path: _.findWhere(aclRoutes, {id: 8}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 8}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.users.update]
    },
    
    // === IMAGES ROUTES ======================================================
    // Display images
    {
        path: _.findWhere(aclRoutes, {id: 4}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 4}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.images.list]
    },
    
    //Get all images related to a study
    {
        path: _.findWhere(aclRoutes, {id: 10}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 10}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.images.getByStudy]
    },
    
    //Saves an image for a study
    {
        path: _.findWhere(aclRoutes, {id: 11}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 11}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.images.save]
    },
    
    //Delete an image
    {
        path: _.findWhere(aclRoutes, {id: 12}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 12}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.images.delete]
    },
        
    // === PATIENTS ROUTES ====================================================
    {
        path: _.findWhere(aclRoutes, {id: 5}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 5}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.patients.list]
    },
    
    {
        path: _.findWhere(aclRoutes, {id: 13}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 13}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.patients.getByUser]
    },
    
    {
        path: _.findWhere(aclRoutes, {id: 20}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 20}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.patients.getByNiss]
    },
    
    // === STUDIES ROUTES =====================================================
    {
        path: _.findWhere(aclRoutes, {id: 6}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 6}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.studies.getRelevantByPatient]
    },
    
    // Get all the available types
    {
        path: _.findWhere(aclRoutes, {id: 9}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 9}).method,
        middleware: [controllers.studies.getAllTypes]
    },
    
    // Delete a study by its id
    {
        path: _.findWhere(aclRoutes, {id: 15}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 15}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.studies.delete]
    },
	//Creating new study
	{
        path: _.findWhere(aclRoutes, {id: 28}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 28}).method,
        middleware: [ controllers.studies.createStudy]
    },
    
    // === ANNOTATIONS ROUTES =====================================================
    // Get all annotations
    {
        path: _.findWhere(aclRoutes, {id: 16}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 16}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.annotations.getAllByImage]
    },  
    
    // Save annotation
    {
        path: _.findWhere(aclRoutes, {id: 17}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 17}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.annotations.save]
    },  
    
    // Get all annotations
    {
        path: _.findWhere(aclRoutes, {id: 18}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 18}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.annotations.delete]
    }, 
    
    // Get all annotations
    {
        path: _.findWhere(aclRoutes, {id: 19}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 19}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.annotations.deleteAllByImage]
    }, 
    
    // === REPORTS ROUTES =====================================================
    // Get all unsatisfying quality causes
    {
        path: _.findWhere(aclRoutes, {id: 21}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 21}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.reports.getUnsatisfyingQualityCauses]
    },
    
    // Save a report
    {
        path: _.findWhere(aclRoutes, {id: 22}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 22}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.reports.save]
    }, 
    
    // Get a report by its type and studyId
    {
        path: _.findWhere(aclRoutes, {id: 23}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 23}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.reports.getByReportTypeAndStudyId]
    }, 
    
    // Get report PDF as Base64
    {
        path: _.findWhere(aclRoutes, {id: 24}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 24}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.reports.getReportPDF]
    },
    // Get report PDF as Stream
    {
        path: _.findWhere(aclRoutes, {id: 29}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 29}).method,
        middleware: [/*jwt({secret: secret}), tokenManager.verifyToken,*/ controllers.reports.getReportPDFStream]
    },
    
    // === UPLOADS ROUTES =====================================================
	{
        path: _.findWhere(aclRoutes, {id: 25}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 25}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.uploads.getFiles]
    },
	{
        path: _.findWhere(aclRoutes, {id: 26}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 26}).method,
        middleware: [jwt({secret: secret}), tokenManager.verifyToken, controllers.uploads.postFiles]
    },
    
    // === SCREENS ROUTES =====================================================
    //Save images extracted from Stages of the viewer
    {
        path: _.findWhere(aclRoutes, {id: 27}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 27}).method,
        middleware: [controllers.screens.saveStageImage]
    },
    
    // === FRONTEND ROUTES ========================================================
    // Route to handle all angular requests
    {
        path: _.findWhere(aclRoutes, {id: 0}).uri,
        httpMethod: _.findWhere(aclRoutes, {id: 0}).method,
        middleware: [controllers.angular]
    }
];


module.exports = function(app) {

    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
};


function ensureAuthorized(req, res, next) {
    if(req.route.path != _.findWhere(aclRoutes, {id: 0}).uri){
        var token = tokenManager.getToken(req.headers);
        if(token != null){
            var decodedToken = jsonwebtoken.decode(token);
            var userID = decodedToken.id;

            db.userModel.findOne({_id: userID}, function (err, user) {
                if(err){
                    console.log(err);
                    return res.send(401);
                }
                if(user){
                    var userRoles = user.roles;

                    var access = _.findWhere(routes, {
                        path: req.route.path, 
                        httpMethod: req.route.method.toUpperCase() 
                    }).access;

                    if(typeof(access) != "undefined"){
                        compareRoles(userRoles, access, function(state){
                            if(state){
                                return next();
                            }
                            else{
                                return res.send(403);
                            }
                        });
                    }
                    else{
                        return next();
                    }
                }
                else{
                    return res.send(401);
                }
            });
        }
        else{
            return next();
        }
    }
    else{
        return next();
    }
}

function compareRoles(userRoles, neededRoles, callback){
    var access = false;
    var total = userRoles.length * neededRoles.length;
    var count = 0;
    userRoles.forEach(function(userRole){
        neededRoles.forEach(function(neededRole){
            if(userRole == neededRole){
                access = true;
            }
            count++;
        });
    });
    if(count == total){
        callback(access);
    }
}
