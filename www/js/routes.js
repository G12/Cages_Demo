angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('cages', {
      url: '/homePage',
      templateUrl: 'templates/Cages.html',
      controller: 'cagesCtrl'
    })

    .state('login', {
      url: '/loginPage',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })

    .state('puzzles', {
      url: '/puzzleSizesPage',
      templateUrl: 'templates/puzzleSizes.html',
      controller: 'puzzlesCtrl'
    })

    .state('gameSelection', {
      url: '/gameSelection/:size',
      templateUrl: 'templates/gameSelection.html',
      controller: 'gameSelectionCtrl'
    })

    .state('gameConfiguration', {
      url: '/gameConfiguration/:size/:id',
      templateUrl: 'templates/gameConfiguration.html',
      controller: 'gameConfigurationCtrl'
    })

    .state('puzzleName', {
      url: '/puzzleName',
      templateUrl: 'templates/puzzleName.html',
      controller: 'puzzleNameCtrl'
    })

    .state('cagesPuzzle', {
      url: '/cagesPuzzle/:bitMask/:numberSetId/:size/:id/:isNew',
      templateUrl: 'templates/CagesPuzzle.html',
      controller: 'cagesPuzzleCtrl'
    })

    .state('signup', {
      url: '/signUpPage',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })

    .state('settings', {
      url: '/settingsPage',
      templateUrl: 'templates/settings.html',
      controller: 'settingsCtrl'
    })

    .state('help', {
      url: '/helpPage',
      templateUrl: 'templates/help.html',
      controller: 'helpCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loginPage');

});
