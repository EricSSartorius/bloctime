angular.module('blocPomodoro', ['ui.router', 'firebase'])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

 	    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
     	});

    $urlRouterProvider.otherwise("/home");

		$stateProvider
			.state('home', {
		    	url: '/home',
		    	controller: 'Home.controller',
		    	templateUrl: '/templates/home.html',
      		});
	})
.controller('Home.controller', function ($scope, $firebaseObject) {
	var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");

  // download the data into a local object
  $scope.data = $firebaseObject(ref);

});
