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
.controller('Home.controller', ['$scope', '$firebaseObject', '$interval', function ($scope, $firebaseObject, $interval) {
	var ref = new Firebase("https://blinding-torch-8353.firebaseio.com");
    $scope.data = $firebaseObject(ref);
    $scope.theTime = 1500;

 //    $scope.startTime = function() {
 //         stop = $interval(function() {
 //            if ($scope.theTime > 0 ) {
 //              $scope.theTime -= $scope.theTime;
 //            } else {
 //              $scope.resetTime();
 //            }
 //          }, 1000);
}])
.directive('myButton', function($interval) {

    return {
        templateUrl: 'templates/start.html',
        restrict: 'E',
        replace: true,
        scope: { },
        link: function(scope, element, attributes) {
        	scope.theButton = "START";
            scope.clickStart = function (event) {
            	if(scope.theButton == "RESET") {
            		//Reset theTime to 1500 here
            		//Stop the interval counting down here
            		scope.theButton = "START";
            	}
            	else {
            		//Start the interval counting down here
            		scope.theButton = "RESET";
            	}
            };
        }    
    }
 })
.filter('timeFilter', function() {
    return function(seconds) {
        var timeFormat = new Date(0,0,0,0,0,0,0);
        timeFormat.setSeconds(seconds);
        return timeFormat;
    };
});