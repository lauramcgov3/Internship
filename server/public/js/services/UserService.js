angular.module('UserService', []).factory('User', ['$http', '$window', function($http, $window) {
    return {
        signUp: function(user) {
            return $http.post('/api/signup', user);
        },
        
        signIn: function(user) {
            return $http.post('/api/signin', user);
        },
 
        signOut: function() {
            return $http.get('/api/signout');
        },
        
        getUsername: function() {
            return $window.localStorage.username || null;
        },
        
        getInformation: function() {
            return $http.get('/api/user');
        },
        
        update: function(user) {
            return $http.put('/api/user', user);
        }
    }
}]);