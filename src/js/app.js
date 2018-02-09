console.log('JS locked and loaded');
// Declare global variables

// Declare global functions

let $board = null;
let $newGame = null;
let $playerDiv = null;
let playerLocation = null;
let boardSize = 0;

//Check for DOM loaded
$(function() {


  // run DOM related functions
  init();
});


function init(){
  console.log('DOM loaded');
  // grab DOM-related variables
  $board = $('.gameboard');
  $playerDiv = $('.player');
  $newGame = $('#newgame');
  // run Functions
  createMap(5);
  // add Event listeners
  $newGame.on('click', newGame);
}

// Declare DOM-related Functions

function createMap(size) {
  boardSize = size * size;
  for (let i = 0; i < size*size; i++){
    $board.append($(`<div style="width: ${(100 / size )}%; height: ${(100 / size )}%; border: 1px solid black;" data-location="${i}";></div>`));
  }
}
function newGame() {
  const startingLocation = Math.floor((Math.random() * boardSize));
  $('div').removeClass('player');
  $(`[data-location="${startingLocation}"]`).toggleClass('player');
  $playerDiv = $('.player');
  playerLocation = $playerDiv.data('location');
  console.log(playerLocation);
}

function moveUp() {

}
function moveDown() {

}
function moveLeft() {

}
function moveRight() {

}
