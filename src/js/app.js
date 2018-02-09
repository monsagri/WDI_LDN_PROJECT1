console.log('JS locked and loaded');
// Declare global variables

// Declare global functions

let $board = null;


//Check for DOM loaded
$(function() {


  // run DOM related functions
  init();
});


function init(){
  console.log('DOM loaded');
  // grab DOM-related variables
  $board = $('.gameboard');
  // run Functions
  createMap(5);

  // add Event listeners
}

// Declare DOM-related Functions

function createMap(size) {
  for (let i = 0; i < size*size; i++){
    $board.append($(`<div style="width: ${(100 / size )}%; height: ${(100 / size )}%; background-color: blue; border: 1px solid black;"></div>`));
  }
}
