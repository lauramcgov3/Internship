angular.module('AuthenticationService', []).factory('Authentication', function() {
    var auth = {
        isAuthenticated: false,
        isNew : false
    }
    return auth;
});