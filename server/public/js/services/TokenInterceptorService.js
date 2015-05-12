angular.module('TokenInterceptorService', []).factory('TokenInterceptor', ['$q', '$window', '$location', 'Authentication', function($q, $window, $location, Authentication) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        
        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.localStorage.token && !Authentication.isAuthenticated) {
                Authentication.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.localStorage.token || Authentication.isAuthenticated)) {
                delete $window.localStorage.username;
                delete $window.localStorage.userID;
                delete $window.localStorage.language;
                delete $window.localStorage.token;
                Authentication.isAuthenticated = false;
                $location.path("/login");
                $window.location.reload();
            }
            else if(rejection != null && (rejection.status === 403 || rejection.status === 400)  
                    && ($window.localStorage.token || Authentication.isAuthenticated)){
                $location.path("/403");
            }
            return $q.reject(rejection);
        }
    };
}]);