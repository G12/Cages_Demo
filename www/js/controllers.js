angular.module('app.controllers', [])

.controller('homePageCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('puzzlesCtrl', function($scope) {

})

.controller('savedGameSelectionCtrl', function($scope, GameFactory, $stateParams) {

  //////////////////////////////////////////   Saved Games List  ////////////////////////////////////////

  $scope.saved_games_list = GameFactory.getSavedGamesList();

  ///////////////////////////////////////////   Accordian  //////////////////////////////////////////////

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  ///////////////////////////////////////////   Item and URL functions ////////////////////////////

  $scope.getNumberSetById = function(number_set_id)
  {
    var number_set = Game.numberSetById(number_set_id);
    return number_set.set.toString();
  };

  $scope.bitMaskToString = function(bitmask)
  {
    return Math_ops.bitMaskToString(bitmask);
  };

  $scope.savedGame = function(){
    GameFactory.setIsNewGame(false);
  }

})

.controller('gameSelectionCtrl', function($scope, GameFactory, $stateParams) {

  $scope.size = $stateParams.size;
  //////////////////////////////////////////   Template List  ////////////////////////////////////////

  $scope.template_list = GameFactory.getTemplateList(parseInt($stateParams.size));

  //////////////////////////////////////////   On Template Selection  ////////////////////////////////

})

.controller('gameConfigurationCtrl', function($scope, $window, GameFactory, $stateParams) {

    ////////////////////////////////////  Operator Check Box list
    //operator checkbox model
    $scope.bitMask = 15;
    $scope.operator = {add:false, subtract:false, multiply:false, divide:false};

    $scope.getOperatorStatus = function()
    {
      return $scope.operator.add || $scope.operator.subtract || $scope.operator.multiply || $scope.operator.divide;
    }

    ////////////////////////////////////  Number set selection list
    $scope.number_set_items = [];
    $scope.selected_id = null; //model - selected number set id
    $scope.current_selection_id = null; //id of the currentl selected number set

    for(var i=0; i < number_sets_json.groups.length; i++)
    {
      if(number_sets_json.groups[i].size === parseInt($stateParams.size))
      {
        $scope.number_set_items = number_sets_json.groups[i].sets;
      }
    }

    //$scope.current_selection_id = $scope.number_set_items[0].id;


    //Update current selection id when number set slection list is changed
    $scope.updateSelection = function(id)
    {
      $scope.current_selection_id = parseInt(id);
      //$scope.drawTemplate();
    };

    //Convert the number set to a readable string for display
    $scope.setToString = function(array)
    {
      var str = "";
      for(var i=0; i < array.length; i++)
      {
        str += " " + array[i];
      }
      return str;
    };

  //TODO drawing preview kills game page - Why?
  /*
    //Initialize and draw template preview
    $scope.drawTemplate = function() {
      if($scope.current_selection_id)
      {
        GameFactory.drawTemplatePreview($window.innerHeight, $window.innerWidth, $stateParams, $scope.current_selection_id, $scope.bitMask);
      }
    }

    angular.element($window).bind('resize', function(){
      $scope.$apply(function() {
        $scope.drawTemplate();
      })
    });
  */

    //Make the url parameters for Cages Puzzle page
    $scope.makeParams = function(){

      if(!$scope.current_selection_id) return false;

      //push the selected operator names onto an array
      var name_array = [];
      if($scope.operator.add) name_array.push("add");
      if($scope.operator.subtract) name_array.push("subtract");
      if($scope.operator.multiply) name_array.push("multiply");
      if($scope.operator.divide) name_array.push("divide");

      //Create the operator Bitmask
      var op_set = Math_ops.makeOperationSet(name_array);
      $scope.bitMask = Math_ops.toBitmask(op_set);

      return $scope.bitMask + "/" + $scope.current_selection_id + "/" + parseInt($stateParams.size) + "/" + $stateParams.id;
    };

    $scope.newGame = function()
    {
      GameFactory.setIsNewGame(true);
      GameFactory.setIsRandomSolution(true);
    }

})
  .controller('puzzleNameCtrl', function($scope){

  })

.controller('cagesPuzzleCtrl', function( $scope, $window, GameFactory, $stateParams) {

  $scope.drawGame = function() {
      GameFactory.startGame($window.innerHeight, $window.innerWidth, $stateParams);
  };

  angular.element($window).bind('resize', function(){
    $scope.$apply(function() {
      $scope.drawGame();
    })
  });

  $scope.drawGame();

})

.controller('signupCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {

  $scope.items = {smartNotes:false,
    smartButtons:false,
    showTimer:false,
    padMode:false,
    alternativeInput:true
  };
  $scope.toggleChanged = function(item)
  {
    alert("item = " + JSON.stringify(item) + " $scope.items " + JSON.stringify($scope.items));
  }
})

.controller('helpCtrl', function($scope) {

})
