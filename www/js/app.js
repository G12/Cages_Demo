// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngStorage'])

.run(function($ionicPlatform, $rootScope, GameFactory, $window) {
  $ionicPlatform.ready(function() {

    if(!window.cordova)
    {
      $("#app_container_div").addClass("app_container_size");
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    GameEvents.setSaveCallback(function (json, scope, gameCompleted) {

      GameFactory.saveGame(json, scope, gameCompleted);

    });

  });


  /**
  The $stateChangeStart event gives you acces to the toState and fromState objects.
  These state objects will contain the configuration properties.

  See https://github.com/angular-ui/ui-router/wiki#state-change-events

   **/
  $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

    //This event is called when the gameSelection page is called
    if(toState.name === "gameSelection")
    {
      //console.log("gameSelection page called");
    }
  });

  $ionicPlatform.on('resume', function(){
    //console.log("$ionicPlatform.on('resume', function()");
  });

  $ionicPlatform.on('pause', function(){
    //alert("Pause");
  });

})

.config(['$localStorageProvider',
function ($localStorageProvider) {
  $localStorageProvider.setKeyPrefix('Cages');
  $localStorageProvider.get('currentJson');
}]);
