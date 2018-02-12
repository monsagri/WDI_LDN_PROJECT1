console.log('JS locked and loaded');
// Declare global variables

// Declare global functions

let $board = null;
let $newGame = null;
let $playerDiv = null;
let $soundButton = null;
let audio = null;

let level = 0;
let startingLocation = 0;
let treasureLocation = 0;
let playerLocation = null;
let boardSize = 0;
let boardHeight = 0;
let boardWidth = 0;
const walls = [2,4,9,11,12,14,18,24,27,32,33,37,38,46,47,52,59,60,62,63,64,66,72,76,79,84,86,91,92,94];
let visibleSquares = [];
let stepsTaken = 0;

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
  $soundButton = $('#sound');
  audio = document.querySelector('audio');
  // run Functions
  createMap(10,10);
  // add Event listeners
  $newGame.on('click', newGame);
  $soundButton.on('click', toggleMusic);
}

// Declare DOM-related Functions

function createMap(height,width) {
  // while ($('.gameboard:first-child')) {
  //   $board.remove($('.gameboard:first-child'));
  // }
  boardSize = height * width;
  boardHeight = height;
  boardWidth = width;
  for (let i = 0; i < boardSize; i++){
    $board.append($(`<div class="floor hidden area" style="width: ${(100 / height )}%; height: ${(100 / width )}%;" data-location="${i}";></div>`));
  }
  addWalls();
}
function addWalls() {
  walls.forEach((location) => {
    $(`[data-location="${location}"]`).removeClass('floor');
    $(`[data-location="${location}"]`).addClass('wall');
  } );
}
function getStartingLocation() {
  startingLocation = Math.floor((Math.random() * boardSize));
  while (walls.includes(startingLocation)) {
    console.log('preventing spawning in a wall');
    startingLocation = Math.floor((Math.random() * boardSize));
  }
}
function getTreasureLocation() {
  treasureLocation = Math.floor((Math.random() * boardSize));
  while (walls.includes(treasureLocation) || treasureLocation === playerLocation) {
    console.log('preventing spawning in a wall');
    treasureLocation = Math.floor((Math.random() * boardSize));
  }
}
function newGame() {
  deactivateMovement();
  $('#scoremessage').addClass('hide');
  // Clear board of old sprites
  $('div').removeClass('player');
  $('.floor').html('');
  // startingLocation = Math.floor((Math.random() * boardSize));
  getStartingLocation();
  getTreasureLocation();
  // Set New Player location Div
  $(`[data-location="${startingLocation}"]`).addClass('player');
  $(`[data-location="${startingLocation}"]`).html('<img src="/images/knight.png">');
  $(`[data-location="${treasureLocation}"]`).html('<img src="/images/treasure.svg">');
  $playerDiv = $('.player');
  // Save Player Location to avoid DOM reference
  playerLocation = $playerDiv.data('location');
  console.log(playerLocation);
  changeVisibility();
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
  changeVisibility();
  stepsTaken ++;
  checkForWin();
}
function moveUp() {
  if ((playerLocation - boardHeight) < 0 || walls.includes((playerLocation - boardHeight)) ) {
    console.log('That\'s a wall.');
  } else {
    console.log('moving up');
    // $playerDiv.removeClass('player');
    // $(`[data-location="${playerLocation}"]`).addClass('player');
    $(`[data-location="${playerLocation}"]`).html('');
    playerLocation -= boardHeight;
    $(`[data-location="${playerLocation}"]`).html('<img src="/images/knight.png">');
    $playerDiv = $('.player');
  }
}
function moveDown() {
  if (playerLocation === (boardSize - boardHeight)||(playerLocation + boardHeight) > boardSize || walls.includes((playerLocation + boardHeight))) {
    console.log('That\'s a wall.');
  } else {
    console.log('moving down');
    // $playerDiv.removeClass('player');
    // $(`[data-location="${playerLocation}"]`).toggleClass('player');
    $(`[data-location="${playerLocation}"]`).html('');
    playerLocation += boardHeight;
    $(`[data-location="${playerLocation}"]`).html('<img src="/images/knight.png">');
    $playerDiv = $('.player');
  }
}
function moveLeft() {
  if ((playerLocation === 0 || playerLocation % boardWidth === 0 || walls.includes((playerLocation - 1)))) {
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
  if ((playerLocation % boardWidth === boardWidth - 1) || walls.includes((playerLocation + 1))) {
    console.log('That\'s a wall.');
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
function changeVisibility() {
  visibleSquares = [];
  visibleSquares.push(playerLocation,visionTop(),visionBottom(),visionLeft(),visionRight());
  $('.area').addClass('hidden');
  visibleSquares.forEach((square) => {
    $(`[data-location="${square}"]`).removeClass('hidden');
  });
}
function visionTop() {
  if ((playerLocation - boardHeight) < 0) return ;
  else return playerLocation-boardHeight;
}
function visionBottom() {
  if (playerLocation === (boardSize - boardHeight)||(playerLocation + boardHeight) > boardSize) return ;
  else return playerLocation+boardHeight;
}
function visionLeft() {
  if ((playerLocation === 0 || playerLocation % boardWidth === 0 )) return ;
  else return playerLocation -1;
}
function visionRight() {
  if (playerLocation % boardWidth === boardWidth - 1) return;
  else return playerLocation + 1;
}
function checkForWin() {
  if (playerLocation === treasureLocation) {
    $('#scoremessage').removeClass('hide');
    $('#score').html(stepsTaken);
    level ++;
    checkForHighscore();
    window.alert('YOU WIN!!!');
    setTimeout(deactivateMovement, 200);
  }
}
function checkForHighscore() {
  if ($('#highscore').html() === '-' || stepsTaken < $('#highscore').html()) $('#highscore').html(stepsTaken);
}
function toggleMusic(e) {
  e.preventDefault();
  if (audio.paused === false) {
    audio.pause();
    console.log('music paused');
  } else {
    audio.play();
    console.log('music playing');
  }
}
