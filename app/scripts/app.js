angular.module('blocPomodoro', ['firebase', 'ui.router'])
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
.controller('Home.controller', ['$scope', '$firebaseObject', '$interval', function ($scope, $interval, $firebaseObject) {
	$scope.theTime = "0:00";
	var ref = new Firebase("https://blinding-torch-8353.firebaseio.com");
    // download the data into a local object
    $scope.data = $firebaseObject(ref);

}])
.directive('myButton', function() {

    return {
        templateUrl: 'templates/start.html',
        restrict: 'E',
        replace: true,
        scope: { },
        link: function(scope, element, attributes) {

            scope.clickStart = function (event) {

            };
        }    
    }
 });