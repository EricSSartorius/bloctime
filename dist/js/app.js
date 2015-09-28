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
        templateUrl: '/templates/mybutton.html',
        restrict: 'E',
        replace: true,
        scope: { },
        link: function(scope, element, attributes) {
        	scope.onBreak = false;
        	scope.theTime = 1500;
    		scope.theButton = "START";
    		scope.breakButton = "BREAK START";
    		var theTimer;
    		
		    scope.clickStart = function() {
		        if(scope.theButton === "RESET"  || scope.breakButton === "BREAK RESET") {
		        	if (scope.onBreak) {
		        		scope.theTime = 300;
		        	}
		        	else {
		           		scope.theTime = 1500;
		            }
		           	$interval.cancel(theTimer);
		           	scope.theButton = "START";
		           	scope.breakButton = "BREAK START";
		        }
		        else {
					scope.breakButton = "BREAK RESET";
		        	scope.theButton = "RESET";
		           	theTimer = $interval(function(){	
		           		scope.theTime--
		           		if (scope.theTime === 0) {
		           			$interval.cancel(theTimer);
		           			if (!scope.onBreak) {
			           			scope.onBreak = true;
			           			scope.theTime = 300;
		            			scope.breakButton ="BREAK START";
		           				scope.theButton = "START";
	            			}
	            			else {
	            				scope.breakButton ="BREAK START";
		           				scope.theButton = "START";
	            				scope.onBreak = false;
			           			scope.theTime = 1500;
	            			}
		           		}
		           	},1000,0);  
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