angular.module('app.controllers', [])

.controller('homePageCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('puzzlesCtrl', function($scope) {

})

.controller('savedGameSelectionCtrl', function($scope, GameFactory, $stateParams) {

  $scope.editMode = false;

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

  $scope.onHold = function()
  {
    alert("I'm Holding");
  },
  $scope.deleteSavedGame = function(index, size, name)
  {
    GameFactory.deleteGame(index, size);
  };

  $scope.getNumberSetById = function(number_set_id)
  {
    //TODO determine why this is called so often and why
    //number_set_id is the entire number_set object
    var number_set = Game.numberSetById(number_set_id);
    if(number_set)
    {
      return number_set.set.toString();
    }
    else
    {
      return "";
    }
  };

  $scope.bitMaskToString = function(bitmask)
  {
    return Math_ops.bitMaskToString(bitmask);
  };

  $scope.testBitmask = function(operation_name, bit_mask)
  {
    return Math_ops.testBitmask(operation_name, bit_mask);
  };

  $scope.savedGame = function(){
    GameFactory.setIsNewGame(false);
  }

})

.controller('gameSelectionCtrl', function($scope, GameFactory, $stateParams, $state) {

  $scope.goToHomePage = function()
  {
    $state.go("homePage");
  };

  $scope.size = $stateParams.size;
  //////////////////////////////////////////   Template List  ////////////////////////////////////////

  $scope.template_list = GameFactory.getTemplateList(parseInt($stateParams.size));

  //////////////////////////////////////////   On Template Selection  ////////////////////////////////

})

.controller('gameConfigurationCtrl', function($scope, $window, GameFactory, $stateParams, $state) {

  $scope.goToHomePage = function()
  {
    $state.go("homePage");
  };

  ////////////////////////////////////  Operator Check Box list
    //operator checkbox model
    $scope.bitMask = 15;

    //Set up check boxes
    $scope.chkDisabled = false;
    $scope.disableReason = "(minimum of two)";
    $scope.operator = {add:false, subtract:false, multiply:false, divide:false};
    var settings = GameFactory.getSettings();
    if(settings.randomOperators != true)
    {
      $scope.disableReason = "(Randomize... Operators is Disabled)";
      $scope.chkDisabled = true;
      var template = GameFactory.getTemplate(parseInt($stateParams.size), parseInt($stateParams.id));
      $scope.operator.add = Math_ops.testBitmask("add", template.bitMask);
      $scope.operator.subtract = Math_ops.testBitmask("subtract", template.bitMask);
      $scope.operator.multiply = Math_ops.testBitmask("multiply", template.bitMask);
      $scope.operator.divide = Math_ops.testBitmask("divide", template.bitMask);

    }

    $scope.checkBoxChanged = function(operator)
    {
      alert("operator value = " + operator);
    }

    $scope.getOperatorStatus = function()
    {
      //Minimum of 2 operators
      var count = 0;
      count = $scope.operator.add ? count + 1 : count;
      count = $scope.operator.subtract ? count + 1 : count;
      count = $scope.operator.multiply ? count + 1 : count;
      count = $scope.operator.divide ? count + 1 : count;

      if(count < 2) return false;

      return $scope.operator.add || $scope.operator.subtract || $scope.operator.multiply || $scope.operator.divide;
    };

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

.controller('cagesPuzzleCtrl', function( $scope, $window, GameFactory, $stateParams, $state, $timeout) {

  $scope.goToHomePage = function()
  {
    $state.go("homePage");
  };

  //TODO possible resize algorythm
  //angular.element($window).bind('resize', function(){
  //  $scope.$apply(function() {
  //  GameFactory.startGame($window.innerHeight, $window.innerWidth, $stateParams);
  //  })
  //});

  //See routes.js - Must set cache false so that Game will always be rendered
  //Also put on timeout que so that rendering does no start till
  //page is showing
  $timeout(function()
  {
    GameFactory.startGame($window.innerHeight, $window.innerWidth, $stateParams);
  },0);


})

.controller('signupCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope, GameFactory)
{

  $scope.items = GameFactory.getSettings();

  $scope.toggleChanged = function(item)
  {
    if($scope.items.randomOperators != true)
    {
      if($scope.items.noNegativeResults)
      {
          $scope.items.noNegativeResults = false;
      }
      $scope.items.noNegativeResults = false;
    }
    if($scope.items.noNegativeResults)
    {
      $scope.items.sortDescending = true;
    }
    GameFactory.updateSettings($scope.items);
  }
})

.controller('helpCtrl', function($scope) {

})
