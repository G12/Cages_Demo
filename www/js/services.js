//Utility Bitmask functions
//var mask = 1 | 2 | 8;
//var a = Utl.addFlag(mask, 4);
//var b = Utl.removeFlag(mask, 4);
//alert("a=" + a + " b=" + b + " mask contains 16 " + Utl.checkFlag(mask, 16));

//Old globals

//TODO remove references to this or implement custom operation sets
var g_operationSet;

var currentGame = {
  gameId: null,
  time: null,
  complete: false,
  gameOn: false
};

//End of old globals

angular.module('app.services', [])

.factory('GameFactory', ['$localStorage','$timeout', function($localStorage, $timeout){

  //Utility functions
  function getTemplateForSizeAndId(size, id)
  {
    for(var i=0; i < game_data.length; i++)
    {
      if(game_data[i].size === size){
        var templates = game_data[i].templates;
        for(var j=0; j < templates.length; j++)
        {
          if(templates[j].id === id)
          {
            //return templates[j];
            //clone and return template
            var str = JSON.stringify(templates[j]);
            return JSON.parse(str);
          }
        }
      }
    }
    return null;
  }

  function getSavedGamesList(size)
  {
    switch(size)
    {
      case 4:
        if(!fours.length)
        {
          fours = $localStorage.fours || [];
        }
        return fours;
      case 5:
        if(!fives.length)
        {
          fives = $localStorage.fives || [];
        }
        return fives;
      case 6:
        if(!sixes.length)
        {
          sixes = $localStorage.sixes || [];
        }
        return sixes;
      case 7:
        if(!sevens.length)
        {
          sevens = $localStorage.sevens || [];
        }
        return sevens;
    }
  }

  //Constants

  var MARGIN = 15;
  var ION_HEADER_BAR_HEIGHT = 48;
  var MIN_TOOLBAR_HEIGHT = 48;
  var MAX_TOOL_BAR_HEIGHT = 52;
  var BAR_RATIO = 0.18;

  //One time initialization

  cvm.box.init();
  PermutationTable.init(6);
  g_number_sets = number_sets_json; //See saved_number_sets.js

  //Important Get save cages for pallete
  CagePallete.init(pallete_obj);


  //Template game data
  var game_data = [
    {
      name:"4x4 Puzzles", templates:template4x4, size:4, number_sets:number_sets_json[0]
    },
    {
      name:"5x5 Puzzles", templates:template5x5, size:5, number_sets:number_sets_json[1]
    },
    {
      name:"6x6 Puzzles", templates:template6x6, size:6, number_sets:number_sets_json[2]
    },
    {
      name:"7x7 Puzzles", templates:template7x7, size:7, number_sets:number_sets_json[3]
    }
  ];

  //Current Game data
  var fours = [];
  var fives = [];
  var sixes = [];
  var sevens = [];

  var current_index;
  var current_size;
  var current_template_name;
  var is_new_game = false;
  var is_random_solution = false;

  var saved_games_list = [
    {name:"4x4 Puzzles", list:[], size:4},
    {name:"5x5 Puzzles", list:[], size:5},
    {name:"6x6 Puzzles", list:[], size:6},
    {name:"7x7 Puzzles", list:[], size:7}
  ];

  //Settings data
  //json.operation_flags = CONST.OP_RANDOM | CONST.OP_SUPRESS_DUPLICATES | CONST.OP_NO_NEGATIVES | CONST.OP_SORT_DESCENDING;

  var settings =
  {
    randomOperators:true,
    noNegativeResults:true,
    noFractions:true,
    //Note when noNegativeResults is true sortDescending must be true
    //The user interface should handle this rule
    sortDescending:true,
    showTimer:false,
    padMode:false,
    alternativeInput:true
  };


  return {
    //Game settings
    getSettings: function()
    {
      if($localStorage.Settings)
      {
        settings = $localStorage.Settings;
      }
      return settings;
    },
    updateSettings: function(settings)
    {
      $localStorage.Settings = settings;
    },

    //Current saved game or games
    setIsNewGame: function(state)
    {
      is_new_game = state;
    },
    setIsRandomSolution: function(state)
    {
      is_random_solution = state;
    },
    setCurrentSize: function(size)
    {
      current_size = size;
    },
    setCurrentTemplateName: function(name)
    {
      current_template_name = name;
    },
    //Saved Game functions
    getSavedGamesList: function()
    {
      saved_games_list[0].list = getSavedGamesList(4);
      saved_games_list[1].list = getSavedGamesList(5);
      saved_games_list[2].list = getSavedGamesList(6);
      saved_games_list[3].list = getSavedGamesList(7);
      return saved_games_list;
    },
    //Remove a saved game from local storage
    deleteGame: function(index, size)
    {
      switch(size)
      {
        case 4:
          fours.splice(index,1);
          $localStorage.fours = fours;
          break;
        case 5:
          fives.splice(index,1);
          $localStorage.fives = fives;
          break;
        case 6:
          sixes.splice(index,1);
          $localStorage.sixes = sixes;
          break;
        case 7:
          sevens.splice(index,1);
          $localStorage.sevens = sevens;
          break;
      }
    },
    //Game selection functions
    getTemplateList: function(size)
    {
      for(var i=0; i < game_data.length; i++)
      {
        if(game_data[i].size === size){
          return game_data[i];
        }
      }
      return null;
    },
    getTemplate: function(size, id)
    {
      return getTemplateForSizeAndId(size, id);
    },
    //Game play functions
    //This is the SaveGame callback
    saveGame: function(json, scope, gameCompleted)
    {
      $timeout(function() {

        switch(current_size) {
          case 4:
            if(is_new_game)
            {
              current_index = fours.length;
              is_new_game = false;
              fours.push(json);
            }
            else
            {
              fours[current_index] = json;
            }
            $localStorage.fours = fours;
            break;
          case 5:
            if(is_new_game)
            {
              current_index = fives.length;
              is_new_game = false;
              fives.push(json);
            }
            else
            {
              fives[current_index] = json;
            }
            $localStorage.fives = fives;
            break;
          case 6:
            if(is_new_game)
            {
              current_index = sixes.length;
              is_new_game = false;
              sixes.push(json);
            }
            else
            {
              sixes[current_index] = json;
            }
            $localStorage.sixes = sixes;
            break;
          case 7:
            if(is_new_game)
            {
              current_index = sevens.length;
              is_new_game = false;
              sevens.push(json);
            }
            else
            {
              sevens[current_index] = json;
            }
            $localStorage.sevens = sevens;
            break;
        }
      }, 0);
    },
    drawTemplatePreview: function(height, width, params, number_set_id, bitMask)
    {
      var size = parseInt(params.size);
      //alert("height: " + height + " width: " + width + " params: " + JSON.stringify(params));
      var json_template = getTemplateForSizeAndId(size, parseInt(params.id));
      if(json_template)
      {
        //Begin page set up
        var operator_set_height = $("#operator_set").height();
        var number_set_height = $("#number_set").height();
        var play_button_height = $("#play_button").height();

        //Subtract the header bar height
        height = height - ION_HEADER_BAR_HEIGHT - operator_set_height - number_set_height - play_button_height;

        //Calculate the width of the game board
        var board_size = height - 2*MARGIN;
        if(board_size > width - 2*MARGIN)
        {
          board_size = width - 2*MARGIN;
        }

        //IMPORTANT set the width value declared in events.js
        //This determines width of game elements
        GameEvents.g_width = board_size;

        //TODO calibrate these values
        var XTRA = 4; //add extra to canvas to allow for rounding
        var H_XTRA = 32; //add extra to canvas to allow for rounding and wide solution labels

        //Change the size of the overlay div
        $("#overlay").css("width", (GameEvents.g_width + XTRA) + 'px')
          .css("height", (GameEvents.g_width + XTRA) + 'px')

        $("#canvas").attr("width", (GameEvents.g_width + H_XTRA) + 'px')
          .attr("height", (GameEvents.g_width + XTRA) + 'px');

        //Finished with page setup

        //Adjust parameters
        json_template.number_set = number_set_id;
        json_template.bitMask = bitMask;

        GameEvents.drawPreview(json_template, "canvas");

      }
      else
      {
        alert("Could not find template for size: " + size + " and id: " + params.id);
        return;
      }

    },
    startGame: function(height, width, params)
    {
      if(!window.cordova) {
        height = $("#app_container_div").innerHeight()*.94;
        width = $("#app_container_div").innerWidth()*.94;
      }

      var json = null;

      //Adjust the rendering of Game
      GameEvents.HEIGHT_ADJUSTMENT = 5; //3 is default
      //GameEvents.DROP_MAX = .78; // default .8

      //TODO work out timer issues and initial setup

      //cvm.box.init();
      //PermutationTable.init(6);
      //g_number_sets = number_sets_json; //See saved_number_sets.js

      var d = $("#timer");
      //Create the stopwatch
      currentGame.time = new Stopwatch(d[0], {delay: 1000});

      GameEvents.startTimer(0);

      GameEvents.loadJQueryEvents();

      //When new game starts reset these values
      GameEvents.g_restore = false;
      GameEvents.g_toggle_functions = true;

      //Begin page set up

      current_size = parseInt(params.size);

      //Subtract the header bar height
      height = height - ION_HEADER_BAR_HEIGHT;

      var cartoucheFunctionListHeight = $("#cartoucheFunctionList").height();
      $("#status_bar").height(cartoucheFunctionListHeight);

      var toolBarHeight = width/(current_size+1); MIN_TOOLBAR_HEIGHT;

      if(2*toolBarHeight/height < BAR_RATIO)
      {
        toolBarHeight = height*BAR_RATIO/2;
        toolBarHeight = toolBarHeight < MAX_TOOL_BAR_HEIGHT ? toolBarHeight : MAX_TOOL_BAR_HEIGHT;
      }

      toolBarHeight = toolBarHeight > MAX_TOOL_BAR_HEIGHT ? MAX_TOOL_BAR_HEIGHT : toolBarHeight;

      //Calculate the width of the game board
      var board_size = height - 2*toolBarHeight - cartoucheFunctionListHeight*2 - 2*MARGIN;
      if(board_size > width - 2*MARGIN)
      {
        board_size = width - 2*MARGIN;
      }

      GameEvents.g_tool_bar_height = toolBarHeight;

      //Contains horizontal list of all numbers and horizontal list of all the tools
      var cartoucheNumbersAndToolsContainer = $("#cartoucheNumbersAndToolsContainer");
      cartoucheNumbersAndToolsContainer.height(toolBarHeight*2);

      //IMPORTANT set the width value declared in events.js
      //This determines width of game elements
      GameEvents.g_width = board_size;

      //TODO calibrate these values
      var XTRA = 4; //add extra to canvas to allow for rounding
      var H_XTRA = 32; //add extra to canvas to allow for rounding and wide solution labels

      //Change the size of the overlay div
      $("#overlay").css("width", (GameEvents.g_width + XTRA) + 'px')
        .css("height", (GameEvents.g_width + XTRA) + 'px')

      $("#canvas").attr("width", (GameEvents.g_width + H_XTRA) + 'px')
        .attr("height", (GameEvents.g_width + XTRA) + 'px');

      //Important Get save cages for pallete
      //CagePallete.init(pallete_obj);
      //Finished with page setup

      //TODO determine if this is a new game
      if(params.numberSetId != "null") //is_new_game) //If this is a new game get template
      {
        var template = getTemplateForSizeAndId(current_size, parseInt(params.id));
        if(template)
        {
          //TODO Game.initNewGame() should be created to handle all new initializations
          Game.status = {count:0, total:current_size*current_size, set_count:0, success:false};

          json = template;

          json.number_set = params.numberSetId;

          if(is_random_solution)
          {
            json.key = Game.generateKey(current_size);
            delete json.size;
          }

          var flags = 0;
          if(settings.randomOperators)
          {
            json.bitMask = params.bitMask;
            flags = flags | CONST.OP_RANDOM;
          }
          if(settings.noNegativeResults)
          {
            flags = flags | CONST.OP_NO_NEGATIVES | CONST.OP_SORT_DESCENDING;
          }
          if(settings.noFractions)
          {
            flags = flags | CONST.OP_NO_FRACTIONS;
          }
          if(settings.sortDescending)
          {
            flags = flags | CONST.OP_SORT_DESCENDING;
          }
          json.operation_flags = flags;

        }
        else
        {
          alert("Could not find template for size: " + current_size + " and id: " + params.id);
          return;
        }
      }
      else
      {
        //get game from local storage
        var gameList = getSavedGamesList(current_size);
        current_index = parseInt(params.id);
        json = gameList[current_index];

        flags = 0; //CONST.OP_STATIC
        if(settings.noFractions)
        {
          flags = flags | CONST.OP_NO_FRACTIONS;
        }
        json.operation_flags = flags;

      }

      //Start auto saving saving game after initial draw?
      GameEvents.g_auto_save = true;
      //Save the Game as an object - NOT as JSON string
      GameEvents.g_save_as_object = true;
      //Don't ask for confirmation when adding hint
      Game.confirm_hint = false;

      GameEvents.drawPage(json);

      if(params.numberSetId != "null") //is_new_game) //If this is a new game
      {
        //After the game has been drawn and processed save
        GameEvents.saveGame(CONST.G_SAVE_GAME, false);
      }

      return json;

    }
  };

}])

.service('BlankService', [function(){

}]);

