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
        	scope.theTime = 10;
    		scope.theButton = "START";
    		scope.breakButton = "BREAK START";
    		var theTimer;
    		scope.sessionCounter = 0;

    		scope.countSession = function() {
    			scope.sessionCounter++;
    			if (scope.sessionCounter === 5) {
    				scope.sessionCounter = 1;
    			}
    			console.log(scope.sessionCounter);
    		};
    		scope.fourthBreak = function() {
    			if (scope.sessionCounter === 4) {
    				scope.theTime = 2;
    			}
    			else {
		        	scope.theTime = 5;
		        }
    		};
    		scope.workTimer = function() {
    			scope.onBreak = true;
				scope.fourthBreak();
				scope.theButton = "START";
    		};
    		scope.breakTimer = function() {
    			scope.onBreak = false;
				scope.theTime = 10;
				scope.breakButton ="BREAK START";
    		};
    		scope.startTimer = function() {
		        theTimer = $interval(function(){	
			        scope.theTime--;
			        if (scope.theTime === 0) {
				        $interval.cancel(theTimer);
				        if (!scope.onBreak) {
					        scope.workTimer();
			            }
			            else {
			            	scope.breakTimer();
			            }
			            
				        
				    }
			    },1000,0);  
    		};
		    scope.clickWork= function() {
		        if(scope.theButton === "RESET") {
		        	scope.theTime = 10;
		        	 $interval.cancel(theTimer);
		        	scope.theButton = "START";
		        	scope.sessionCounter --;
		        }
		        else {
		        	scope.theButton = "RESET";
					scope.startTimer();
					scope.countSession();
		        }   
			};
			scope.clickBreak= function() {
		        if(scope.breakButton === "BREAK RESET") {
		        	scope.fourthBreak();
		        	$interval.cancel(theTimer);
		        	scope.breakButton = "BREAK START";
		        	
		        }
		        else {
		        	scope.breakButton = "BREAK RESET";
					scope.startTimer();
					
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