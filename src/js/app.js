console.log('JS locked and loaded');
// Declare global variables

// Declare global functions

let $board = null;
let $newGame = null;
let $playerDiv = null;
let startingLocation = 0;
let treasureLocation = 0;
let playerLocation = null;
let boardSize = 0;
let boardLength = 0;

//Check for DOM loaded
$(function() {
  // run DOM related functions
  init();
});
function activateMovement() {
  $('body').keydown(move);
}
function deactivateMovement() {
  $('body').off('keydown');
}
function init(){
  console.log('DOM loaded');
  // grab DOM-related variables
  $board = $('.gameboard');
  $playerDiv = $('.player');
  $newGame = $('#newgame');
  // run Functions
  createMap(6);
  // add Event listeners
  $newGame.on('click', newGame);
}

// Declare DOM-related Functions

function createMap(size) {
  // while ($('.gameboard:first-child')) {
  //   $board.remove($('.gameboard:first-child'));
  // }
  boardSize = size * size;
  boardLength = size;
  for (let i = 0; i < size*size; i++){
    $board.append($(`<div class="area" style="width: ${(100 / size )}%; height: ${(100 / size )}%; border: 1px solid black; background-image: url(/images/floor.png);" data-location="${i}";></div>`));
  }
}
function newGame() {
  deactivateMovement();
  $('.area').html('');
  startingLocation = Math.floor((Math.random() * boardSize));
  treasureLocation = Math.floor((Math.random() * boardSize));
  // Clear board of old player sprite
  $('div').removeClass('player');
  // Set New Player location Div
  $(`[data-location="${startingLocation}"]`).toggleClass('player');
  $(`[data-location="${startingLocation}"]`).html('<img src="/images/knight.png">');
  $(`[data-location="${treasureLocation}"]`).html('<img src="/images/treasure.svg">');
  $playerDiv = $('.player');
  // Save Player Location to avoid DOM reference
  playerLocation = $playerDiv.data('location');
  console.log(playerLocation);

  // Toggle Event Listeners for movement
  activateMovement();
}

function move(e) {
  console.log(e.keyCode);
  const key = e.keyCode;
  deactivateMovement();
  setTimeout(activateMovement, 100);
  if (key === 87) moveUp();
  if (key === 83) moveDown();
  if (key === 65) moveLeft();
  if (key === 68) moveRight();
  checkForWin();
}
function moveUp() {
  if ((playerLocation - boardLength) < 0) {
    console.log('You can\'t leave.');
  } else {
    console.log('moving up');
    // $playerDiv.removeClass('player');
    // $(`[data-location="${playerLocation}"]`).addClass('player');
    $(`[data-location="${playerLocation}"]`).html('');
    playerLocation -= boardLength;
    $(`[data-location="${playerLocation}"]`).html('<img src="/images/knight.png">');
    $playerDiv = $('.player');
  }
}
function moveDown() {
  if (playerLocation === (boardSize - boardLength)||(playerLocation + boardLength) > boardSize) {
    console.log('You can\'t leave.');
  } else {
    console.log('moving down');
    // $playerDiv.removeClass('player');
    // $(`[data-location="${playerLocation}"]`).toggleClass('player');
    $(`[data-location="${playerLocation}"]`).html('');
    playerLocation += boardLength;
    $(`[data-location="${playerLocation}"]`).html('<img src="/images/knight.png">');
    $playerDiv = $('.player');
  }
}
function moveLeft() {
  if ((playerLocation === 0||playerLocation % boardLength === 0 )) {
    console.log('You can\'t leave.');
  } else {
    console.log('moving left');
    // $playerDiv.removeClass('player');
    // $(`[data-location="${playerLocation}"]`).toggleClass('player');
    $(`[data-location="${playerLocation}"]`).html('');
    playerLocation -= 1;
    $(`[data-location="${playerLocation}"]`).html('<img src="/images/knight.png">');

    $playerDiv = $('.player');
  }
}
function moveRight() {
  if ((playerLocation % boardLength === boardLength - 1)) {
    console.log('You can\'t leave.');
  } else {
    console.log('moving right');
    // $playerDiv.removeClass('player');
    // $(`[data-location="${playerLocation}"]`).toggleClass('player');
    $(`[data-location="${playerLocation}"]`).html('');
    playerLocation += 1;
    $(`[data-location="${playerLocation}"]`).html('<img src="/images/knight.png">');
    $playerDiv = $('.player');
  }
}
function checkForWin() {
  if (playerLocation === treasureLocation) {
    window.alert('YOU WIN!!!');
    setTimeout(deactivateMovement, 200);
  }
}
