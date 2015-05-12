angular.module('appRoutesConfig', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/signin', {
			templateUrl: 'views/signin.html',
            controller: 'SigninController',
            access: { requiredAuthentication: false}
		})
    
        .when('/signup', {
			templateUrl: 'views/signup.html',
            controller: 'SignupController',
            access: { requiredAuthentication: false }
		})
    
        .when('/', {
			templateUrl: 'views/home.html',
			controller: 'PatientController',
            access: { requiredAuthentication: true }
		})
		.when('/images', {
			templateUrl: 'views/images.html',
			controller: 'ImageController',
            access: { requiredAuthentication: true }
		})
        .when('/patient/:id', {
            templateUrl: 'views/patient.html',
            controller: 'StudyController',
            access: { requiredAuthentication: true}
        })
        .when('/patient/:id/viewer/:path', {
            templateUrl: 'views/viewer.html',
            controller: 'ViewerController',
            access: { requiredAuthentication: true}
        })
        .when('/user', {
            templateUrl: 'views/user.html',
            controller: 'UserController',
            access: { requiredAuthentication: true}
        })
        .when('/viewer/:id', {
            templateUrl: 'views/viewer.html',
            controller: 'ViewerController', 
            access: { requiredAuthentication: true}
        })
        .otherwise({
            templateUrl: 'views/error.html',
            access: { requiredAuthentication: true }
        });
    
    $locationProvider.html5Mode(true);
    
}]).run(['$rootScope', '$location', 'Authentication', '$window', 'User', 'TokenInterceptor', function($rootScope, $location, Authentication, $window, User, TokenInterceptor) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set        
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !Authentication.isAuthenticated && !$window.localStorage.token) {
            $location.path("/signin");
        }
    });
}]);

angular.module('TokenInterceptorConfig', []).config(['$httpProvider',function($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
}]);