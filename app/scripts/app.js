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
}])
.directive('myButton', function($interval) {

    return {
        template: '<div><h1>{{ theTime | timeFilter | date:"mm:ss"}}</h1><button ng-click="clickStart()"><b>{{theButton}}<b></button><div>',
        restrict: 'E',
        replace: true,
        scope: { },
        link: function(scope, element, attributes) {
        	scope.onBreak = false;
        	scope.theTime = 1500;
    		scope.theButton = "START";
    		var theTimer;

		    scope.clickStart = function() {
		        if(scope.theButton == "RESET") {
		           	scope.theTime = 1500;
		           	$interval.cancel(theTimer);
		           	scope.theButton = "START";
		        }
		        else {
		           	theTimer = $interval(function(){scope.theTime--},1000,0);
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