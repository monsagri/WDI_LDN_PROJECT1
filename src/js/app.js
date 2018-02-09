console.log('JS locked and loaded');
// Declare global variables

// Declare global functions

let $board = null;
let $newGame = null;
let $playerDiv = null;
let playerLocation = null;
let boardSize = 0;
let boardLength = 0;

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
  boardLength = size;
  for (let i = 0; i < size*size; i++){
    $board.append($(`<div style="width: ${(100 / size )}%; height: ${(100 / size )}%; border: 1px solid black;" data-location="${i}";></div>`));
  }
}
function newGame() {
  const startingLocation = Math.floor((Math.random() * boardSize));
  // Clear board of old player sprite
  $('div').removeClass('player');
  // Set New Player location Div
  $(`[data-location="${startingLocation}"]`).toggleClass('player');
  $playerDiv = $('.player');
  // Save Player Location to avoid DOM reference
  playerLocation = $playerDiv.data('location');
  console.log(playerLocation);

  // Toggle Event Listeners for movement
  $('body').keydown(move);
}

function move(e) {
  console.log(e.keyCode);
  const key = e.keyCode;
  if (key === 87) moveUp();
  if (key === 83) moveDown();
  if (key === 65) moveLeft();
  if (key === 68) moveRight();

}
function moveUp() {
  if ((playerLocation -= boardLength) < 0) {
    console.log('You can\'t leave.');
  } else {
    console.log('moving up');
    $playerDiv.removeClass('player');
    $(`[data-location="${playerLocation - boardLength}"]`).toggleClass('player');
    playerLocation -= boardLength;
    $playerDiv = $('.player');
  }
}
function moveDown() {
  if ((playerLocation += boardLength) > boardSize) {
    console.log('You can\'t leave.');
  } else {
    console.log('moving down');
    $playerDiv.removeClass('player');
    $(`[data-location="${playerLocation + boardLength}"]`).toggleClass('player');
    playerLocation += boardLength;
    $playerDiv = $('.player');
  }
}
function moveLeft() {
  if ((playerLocation === 0||playerLocation % boardLength === 0 )) {
    console.log('You can\'t leave.');
  } else {
    console.log('moving left');
    $playerDiv.removeClass('player');
    $(`[data-location="${playerLocation - 1}"]`).toggleClass('player');
    playerLocation -= 1;
    $playerDiv = $('.player');
  }
}
function moveRight() {
  if ((playerLocation % boardLength === boardLength - 1)) {
    console.log('You can\'t leave.');
  } else {
    console.log('moving right');
    $playerDiv.removeClass('player');
    $(`[data-location="${playerLocation + 1}"]`).toggleClass('player');
    playerLocation += 1;
    $playerDiv = $('.player');
  }
}
