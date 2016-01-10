/* CARTOUCHE FUNCTIONS */
function startCartouche(json, height, width) {

  var MARGIN = 15;
  //Tool and number button container size control
  var HEIGHT_FACTOR = 2;
  var IPAD_WIDTH = 750;
  var IPAD_HEIGHT = 920;
  var MAX_TOOLBAR_WIDTH = 500;
  var TOOLBAR_ICON_COUNT = 6;

  //Test area
  //Math_ops.test();

  //TODO move these out for one time initialization
  cvm.box.init();
  PermutationTable.init(6);

  //var selected_number_set_id = json.number_set;

  //IMPORTANT
  //Set the global object One time only
  //declared in objects.js
  if (!g_number_sets) {
    g_number_sets = number_sets_json; //See saved_number_sets.js
  }

  //TODO get the number set from json
  //Sets Game.number_set
  //var number_set_obj = Game.numberSetById(selected_number_set_id, g_number_sets);

  //When new game starts reset this value
  GameEvents.g_restore = false;
  GameEvents.g_toggle_functions = true;

  //Contains puzzle, numbers and tools, contains everything except the top header
  var cartouchePuzzleContainer = document.querySelector('#cartouchePuzzleContainer');
  //Contains horizontal list of all numbers and horizontal list of all the tools
  var cartoucheNumbersAndToolsContainer = document.querySelector('#cartoucheNumbersAndToolsContainer');
  //Contains horizontal list of image buttons for cartouche tools undo, redo, erase ...
  var cartoucheToolsContainer = document.querySelector('#cartoucheToolsContainer');

  //Calculate the available height of the users screen, -45 is the height of the top header
  var cHeight;

  //Calculate the width of the game board
  var cWidth = cartouchePuzzleContainer.offsetWidth;
  //Limit maximum width to 750 (ipad width)
  cWidth = cWidth > IPAD_WIDTH ? IPAD_WIDTH : cWidth;

  //Get height of cartoucheToolsContainer (tool icon distribution determines height)
  //Calculate the height width divided by number of icons (normally six toolbar icons wide)
  GameEvents.g_tool_bar_height = (cWidth - MARGIN * 2)/TOOLBAR_ICON_COUNT;

  //Total toolbar height - add up all components
  var tHeight = GameEvents.g_tool_bar_height * HEIGHT_FACTOR;
  //Set the container height now so dynamically drawn items will fit above tool icons
  cartoucheNumbersAndToolsContainer.style.height = tHeight + "px";

  //Adjust for landscape mode
  if ((cHeight - tHeight) < cWidth) {
    cWidth = cHeight - tHeight;
  }

  //IMPORTANT set the width value declared in events.js
  //This determines width of game elements
  GameEvents.g_width = cWidth - MARGIN * 2; //set width for event object

  //Calculate the height of the Puzzle Container
  var funcionListHeight = document.querySelector('#cartoucheFunctionList').offsetHeight;
  //var function_legendHeight = document.querySelector(('#function_legend')).offsetHeight;
  var cartouchePuzzleContainerHeight = cHeight - tHeight - funcionListHeight;

  //Calculate the amount of padding above the puzzle
  var topPadding = (cartouchePuzzleContainerHeight - GameEvents.g_width) / 2;
  //Set height of the cartouchePuzzleContainer
  cartouchePuzzleContainer.style.height = cartouchePuzzleContainerHeight + "px";


  var XTRA = 4; //add extra to canvas to allow for rounding
  var H_XTRA = 32; //add extra to canvas to allow for rounding and wide solution labels

  cartouchePuzzleContainer.style.paddingTop = topPadding + "px";

  //Set the top padding
  //$("#function_legend").css("height", topPadding + 'px');

  $("#function_legend").css("height", 15 + 'px');

  //Change the size of the overlay div
  $("#overlay").css("width", (GameEvents.g_width + XTRA) + 'px')
    .css("height", (GameEvents.g_width + XTRA) + 'px')

  $("#canvas").attr("width", (GameEvents.g_width + H_XTRA) + 'px')
    .attr("height", (GameEvents.g_width + XTRA) + 'px');

  //TODO remove this if not needed
  //Get save cages for pallete
  CagePallete.init(pallete_obj);

  $("#hint").html("");

  //Uncomment to work with sample json and experiment with bitMap
  //json = sample;
  //json = save_game_sample;
  //json = multi_solution_result1; //multi_solution_tester; //sample3;

  //Uncomment this to generate random operation configuration
  json.operation_flags = CONST.OP_RANDOM | CONST.OP_SUPRESS_DUPLICATES;

  //Utility Bitmask functions
  //var mask = 1 | 2 | 8;
  //var a = Utl.addFlag(mask, 4);
  //var b = Utl.removeFlag(mask, 4);
  //alert("a=" + a + " b=" + b + " mask contains 16 " + Utl.checkFlag(mask, 16));

  GameEvents.drawPage(json);

}

GameEvents.setSaveCallback(function (json, scope, gameCompleted) {

  //kSQLite.saveGame(json, currentGame.time.getTimeStr(), currentGame.gameId, gameCompleted);
  alert("Save Game Now!");

});
