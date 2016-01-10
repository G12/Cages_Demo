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

//var str ='{"number_set":40,"key":"Zv9iA","solution":[[[1,null],[2,null],[4,null],[3,null]],[[4,null],[1,null],[3,null],[2,null]],[[2,null],[3,null],[1,null],[4,null]],[[3,null],[4,null],[2,null],[1,null]]],"operation_set":[],"c":[{"i":11,"t":0,"x":1,"y":0,"op":0,"rt":{"solutions":[[{"x":1,"y":0,"val":2},{"x":3,"y":1,"val":2}],[{"x":1,"y":0,"val":null},{"x":3,"y":1,"val":null}]],"eq":"((4*3)-2-2)"},"c":[{"i":0,"t":1,"x":2,"y":0,"op":3,"rt":{"solutions":[[{"x":2,"y":0,"val":4},{"x":3,"y":0,"val":3}],[{"x":2,"y":0,"val":null},{"x":3,"y":0,"val":null}]],"eq":"(4*3)"},"o":"C7_"}],"o":"CsX"},{"i":3,"t":0,"x":0,"y":0,"op":0,"rt":{"solutions":[[{"x":0,"y":0,"val":1}],[{"x":0,"y":0,"val":null}]],"eq":"((4*2)-1)"},"c":[{"i":1,"t":1,"x":0,"y":1,"op":3,"rt":{"solutions":[[{"x":0,"y":1,"val":4},{"x":0,"y":2,"val":2}],[{"x":0,"y":1,"val":null},{"x":0,"y":2,"val":null}]],"eq":"(4*2)"},"o":"Cd2"}],"o":"Bk"},{"i":20,"t":0,"x":1,"y":2,"op":3,"rt":{"solutions":[[{"x":0,"y":3,"val":3},{"x":2,"y":3,"val":2}],[{"x":0,"y":3,"val":null},{"x":2,"y":3,"val":null}]],"eq":"((3-4)*3*2)"},"c":[{"i":1,"t":1,"x":1,"y":2,"op":0,"rt":{"solutions":[[{"x":1,"y":2,"val":3},{"x":1,"y":3,"val":4}],[{"x":1,"y":2,"val":null},{"x":1,"y":3,"val":null}]],"eq":"(3-4)"},"o":"CvN"}],"o":"ChT"},{"i":0,"t":0,"x":1,"y":1,"op":3,"rt":{"solutions":[[{"x":1,"y":1,"val":1},{"x":2,"y":1,"val":3}],[{"x":1,"y":1,"val":null},{"x":2,"y":1,"val":null}]],"eq":"(1*3)"},"c":[],"o":"Ctx"},{"i":6,"t":0,"x":2,"y":2,"op":3,"rt":{"solutions":[[{"x":3,"y":3,"val":1}],[{"x":3,"y":3,"val":null}]],"eq":"((1-4)*1)"},"c":[{"i":0,"t":1,"x":2,"y":2,"op":0,"rt":{"solutions":[[{"x":2,"y":2,"val":1},{"x":3,"y":2,"val":4}],[{"x":2,"y":2,"val":null},{"x":3,"y":2,"val":null}]],"eq":"(1-4)"},"o":"C.I"}],"o":"CF"}],"current_notes":null,"bitMask":0}';
//var obj = JSON.parse(str);

//var json = save_game_sample; // sample;
var json = template5x5[0];
json.key = null;
json.size = 5;

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



  //Constants

  var MARGIN = 15;
  var ION_HEADER_BAR_HEIGHT = 48;
  var MIN_TOOLBAR_HEIGHT = 48;
  var MAX_TOOL_BAR_HEIGHT = 52;
  var BAR_RATIO = 0.18;

  var isGameOn = false;
  var status = "uninitialized";
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

  var saved_games = [];
  var current_saved_game_index = null;
  if($localStorage.savedGames)
  {
    saved_games = $localStorage.savedGames;
  }

  return {
    //Current saved game or games

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
    //Game play functions
    //This is the SaveGame callback
    saveGame: function(json, scope, gameCompleted)
    {
      $timeout(function() {

        //Save to the current game
        $localStorage.currentJson = json;
        //console.log("SAVED JSON: " + JSON.stringify(json));
        //alert("Save Game");
      }, 0);
      if(isGameOn)
      {
        status = "Game is ON";
      }
      else{
        status = "Game is OFF";
      }
    },
    isGameOn: function()
    {
      return isGameOn;
    },
    getStatus: function()
    {
      return status;
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
      GameEvents.HEIGHT_ADJUSTMENT = 5; //3 is default
      //GameEvents.DROP_MAX = .78; // default .8

      isGameOn = false;
      //TODO work out timer issues and initial setup
      if(!isGameOn)
      {
        //Clear local storage for current game
        delete $localStorage.currentJson;

        //cvm.box.init();
        //PermutationTable.init(6);
        //g_number_sets = number_sets_json; //See saved_number_sets.js

        var d = $("#timer");
        //Create the stopwatch
        currentGame.time = new Stopwatch(d[0], {delay: 1000});

        GameEvents.startTimer();

        isGameOn = true;
      }

      GameEvents.loadJQueryEvents();

      //When new game starts reset these values
      GameEvents.g_restore = false;
      GameEvents.g_toggle_functions = true;

      //Begin page set up

      var size = parseInt(params.size);

      //Subtract the header bar height
      height = height - ION_HEADER_BAR_HEIGHT;

      var cartoucheFunctionListHeight = $("#cartoucheFunctionList").height();
      $("#status_bar").height(cartoucheFunctionListHeight);

      var toolBarHeight = width/(size+1); MIN_TOOLBAR_HEIGHT;

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
      if(params.isNew === "y") //If this is a new game get template
      {
        var template = getTemplateForSizeAndId(size, parseInt(params.id));
        if(template)
        {
          json = template;
          json.number_set = params.numberSetId;
          json.bitMask = params.bitMask;

          //New game starting deal with old
          delete $localStorage.currentJson;
        }
        else
        {
          alert("Could not find template for size: " + size + " and id: " + params.id);
          return;
        }
      }

      if($localStorage.currentJson)
      {
        json = $localStorage.currentJson;
        json.operation_flags = CONST.OP_STATIC;
      }
      else
      {
        //Test Random generation
        if(!json.key)
        {
          json.key = Game.generateKey(json.size);
          delete json.size;
        }
        //generate random operation configuration
        json.operation_flags = CONST.OP_RANDOM | CONST.OP_SUPRESS_DUPLICATES;
      }

      //Start auto saving saving game after initial draw?
      GameEvents.g_auto_save = true;
      //Save the Game as an object - NOT as JSON string
      GameEvents.g_save_as_object = true;

      GameEvents.drawPage(json);

      //After the game has been drawn and processed save
      if(!$localStorage.currentJson)
      {
        GameEvents.saveGame(CONST.G_SAVE_GAME, false);
      }
    }
  };

}])

.service('BlankService', [function(){

}]);

