angular.module('blocPomodoro', ['firebase', 'ui.router'])
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
.controller('Home.controller', ['$scope', '$rootScope', '$firebaseAuth','MyTasks', function ($scope, $rootScope, $firebaseAuth, MyTasks) {

    // $scope.signIn = function () {
    //   $rootScope.auth.$login('password', {
    //     email: $scope.email,
    //     password: $scope.password
    //   }).then(function(user) {
    //     $rootScope.alert.message = '';
    //   }, function(error) {
    //     if (error = 'INVALID_EMAIL') {
    //       console.log('email invalid or not signed up — trying to sign you up!');
    //       $scope.signUp();
    //     } else if (error = 'INVALID_PASSWORD') {
    //       console.log('wrong password!');
    //     } else {
    //       console.log(error);
    //     }
    //   });
    // };

    // $scope.signUp = function() {
    //   $rootScope.auth.$createUser($scope.email, $scope.password, function(error, user) {
    //     if (!error) {
    //       $rootScope.alert.message = '';
    //     } else {
    //       $rootScope.alert.class = 'danger';
    //       $rootScope.alert.message = 'The username and password combination you entered is invalid.';
    //     }
    //   });
    // };

    $scope.loginToFB = function() {
   
    };
    $scope.signUp = function() {

    };
    $scope.signIn = function() {

    };

    $scope.addTask = function() {
      MyTasks.all.$add({
        content: $scope.task,
        timestamp: Firebase.ServerValue.TIMESTAMP
      });
      $scope.task = "";
    };

    $scope.tasks = MyTasks.all;

    MyTasks.all.$loaded(function() {
      if (MyTasks.all.length === 0) {
        MyTasks.all.$add({
          content: "Add a new Task here!",
          timestamp: Firebase.ServerValue.TIMESTAMP
        });
      }
    });

}])
.factory('MyTasks', ['$firebaseArray', function($firebaseArray) {

	var ref = new Firebase("https://blinding-torch-8353.firebaseio.com");


	function authDataCallback(authData) {
	  if (authData) {
	    console.log("User " + authData.uid + " is logged in with " + authData.provider);
	  } else {
	    console.log("User is logged out");
	  }
	}

	ref.onAuth(authDataCallback);


	
	ref.authWithOAuthPopup("facebook", function(error, authData) {
	  if (error) {
	    console.log("Login Failed!", error);
	  } else {
	    console.log("Authenticated successfully with payload:", authData);
	  }
	});
	ref.createUser({
	  email    : "iamtheepic@gmail.com",
	  password : "kimchiplease"
	}, function(error, userData) {
	  if (error) {
	    console.log("Error creating user:", error);
	  } else {
	    console.log("Successfully created user account with uid:", userData.uid);
	  }
	});
	ref.authWithPassword({
	  email    : "iamtheepic@gmail.com",
	  password : "kimchiplease"
	}, function(error, authData) {
	  if (error) {
	    console.log("Login Failed!", error);
	  } else {
	    console.log("Authenticated successfully with payload:", authData);
	  }
	});
	ref.authWithPassword({
	  email    : "iamtheepic@gmail.com",
	  password : "kimchiplease"
	}, function(error, authData) { /* Your Code */ }, {
	  remember: "sessionOnly"
	});

	var tasks = $firebaseArray(ref);

	return {
	    all: tasks
	};
}])
.constant("MY_EVENTS", {
	breakTime: 300,
	workTime: 1500,
	longBreakTime: 1800,
	workCycle: 4
})
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
.filter('timeFilter', function() {
    return function(seconds) {
        var timeFormat = new Date(0,0,0,0,0,0,0);
        timeFormat.setSeconds(seconds);
        return timeFormat;
    };
});