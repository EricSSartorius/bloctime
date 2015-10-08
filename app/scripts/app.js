angular.module('blocPomodoro', ['firebase', 'ngMaterial', 'ui.router'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
 	$locationProvider.html5Mode({
       enabled: true,
       requireBase: false
    });
    $urlRouterProvider.otherwise("/home");
	$stateProvider.state('home', {
		url: '/home',
		controller: 'Home.controller',
		templateUrl: '/templates/home.html',
    });
})
.controller('Home.controller',  function ($scope, $rootScope, MyTasks, Auth, $timeout, $mdSidenav, $mdUtil, $log) {
    $scope.toggleRight = buildToggler('right');
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },200);
      return debounceFn;
    }
    Auth.firebaseAuth.$onAuth(function(authData) {
    	$scope.authData = authData;
    	console.log(authData);
    });
    $scope.loginToFB = function() {
   		Auth.firebaseAuth.$authWithOAuthPopup("facebook").catch(function(error) {
			console.error(error);
		});
    };
    $scope.register = function() {
    	Auth.signUp($scope.email, $scope.password);
    };
    $scope.login = function() {
    	Auth.logIn($scope.email, $scope.password);
    };
    $scope.logOut = function() {
		Auth.firebaseAuth.$unauth();
		
    };
    $rootScope.$on("reset", function(event){
		$scope.tasks = MyTasks.all();
		console.log("tasks reset");
	});
    $scope.addTask = function() {
      MyTasks.all().$add({
        content: $scope.task,
        timestamp: Firebase.ServerValue.TIMESTAMP
      });
      $scope.task = "";
    };

    $scope.tasks = MyTasks.all();

})
.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
        });
    };
  })
.factory('Auth', function($firebaseAuth) {
	var ref = new Firebase("https://blinding-torch-8353.firebaseio.com/");

	return {
		firebaseAuth: $firebaseAuth(ref),
		signUp:	function(email, password){
			ref.createUser({
			  email    : email,
			  password : password
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			    alert("Error creating user. Please try again.");
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			    alert("Thank you for registering. Please login.", userData.uid);
			  }
			});
		},
		logIn: function(email, password) {
			ref.authWithPassword({
			  email    : email,
			  password : password,
			}, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			    alert("Username or Password is incorrect. Please try again.");
			  } 
			});
		}
	}
})
.factory('MyTasks', ['$firebaseArray','$rootScope', function($firebaseArray, $rootScope) {

	var ref = new Firebase("https://blinding-torch-8353.firebaseio.com/");
	var tasks = [];

	function authDataCallback(authData) {
	  if (authData) {
	    console.log("User " + authData.uid + " is logged in with " + authData.provider);
	    var taskRef = new Firebase("https://blinding-torch-8353.firebaseio.com/users/" + authData.uid);
        tasks = $firebaseArray(taskRef);
	  } else {
	    console.log("User is logged out");
	  }
	   $rootScope.$emit('reset');
	}
	ref.onAuth(authDataCallback);

	return {
	    all: function(){return tasks;}
	};
}])
.directive('myButton', ['MY_EVENTS', "$interval", function(MY_EVENTS, $interval) {
    return {
        templateUrl: '/templates/mybutton.html',
        restrict: 'E',
        replace: true,
        scope: { },
        link: function(scope, element, attributes) {
        	scope.onBreak = false;
        	scope.theTime = MY_EVENTS.workTime;
        	scope.sessionCounter = 0;
    		scope.theButton = "START";
    		scope.breakButton = "BREAK START";
    		scope.$watch('theTime', function() {
 				if (scope.theTime === 0) {
      				mySound.play();
 				}
			});
    		var theTimer;
    		var mySound = new buzz.sound( "/sounds/dingdong", {
  				formats: [ 'mp3' ],
  				preload: true
			});
    		scope.determineBreak = function() {
    			if (scope.sessionCounter === MY_EVENTS.workCycle) {
    				scope.theTime = MY_EVENTS.longBreakTime;
    			}
    			else {
		        	scope.theTime = MY_EVENTS.breakTime;
		        }
    		};
    		scope.resetPomodoTimer = function() {
    			scope.onBreak = true;
    			scope.sessionCounter++;
				scope.determineBreak();
				if (scope.sessionCounter === MY_EVENTS.workCycle) {
    				scope.sessionCounter = 0;
    			}
				scope.theButton = "START";
    		};
    		scope.resetBreakTimer = function() {
    			scope.onBreak = false;
				scope.theTime = MY_EVENTS.workTime;
				scope.breakButton ="BREAK START";
    		};
    		scope.startTimer = function() {
		        theTimer = $interval(function(){	
			        scope.theTime--;
			        if (scope.theTime <0) {
				        $interval.cancel(theTimer);
				        if (!scope.onBreak) {
					        scope.resetPomodoTimer();
			            }
			            else {
			            	scope.resetBreakTimer();
			            }
				    }
			    },1000,0);  
    		};
		    scope.handleWorkClick= function() {
		        if(scope.theButton === "RESET") {
		        	scope.theTime = MY_EVENTS.workTime;
		        	$interval.cancel(theTimer);
		        	scope.theButton = "START";
		        }
		        else {
		        	scope.theButton = "RESET";
					scope.startTimer();
		        }   
			};
			scope.handleBreakClick= function() {
		        if(scope.breakButton === "BREAK RESET") {
		        	scope.determineBreak();
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
 }])
.constant("MY_EVENTS", {
	breakTime: 300,
	workTime: 1500,
	longBreakTime: 1800,
	workCycle: 4
})
.filter('timeFilter', function() {
    return function(seconds) {
        var timeFormat = new Date(0,0,0,0,0,0,0);
        timeFormat.setSeconds(seconds);
        return timeFormat;
    };
});