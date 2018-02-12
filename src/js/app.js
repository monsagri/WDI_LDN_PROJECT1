console.log('JS locked and loaded');
// Declare global variables

// Declare global functions

let $board = null;
let $newGame = null;
let $playerDiv = null;
let $soundButton = null;
let audio = null;

let level = 2;
let startingLocation = 0;
let treasureLocation = 0;
let playerLocation = null;
let boardSize = 0;
let boardHeight = 0;
let boardWidth = 0;
const walls = [[2,4,9,11,12,14,18,24,27,32,33,37,38,46,47,52,59,60,62,63,64,66,72,76,79,84,86,91,92,94],[3,6,9,15,23,28,33,34,35,36,37,41,44,47,57,59,63,64,66,67,72,77,82,91,93,99,105,109,110,111,114,120,122,123,126,131,135,138,143,158,160,161,163,164,165,166,168,171,178,188,192,197],[3,33,63,93,123,122,120,181,211,212,213,214,243,273,303,333,363,393,423,453,483,573,271,331,391,451,541,542,543,336,366,396,426,456,486,516,337,367,397,427,457,487,517]];
let visibleSquares = [];
let stepsTaken = 0;

const mapDimensions = [[10,10],[20,10],[30,20]];

//Check for DOM loaded
$(function() {
  // run DOM related functions
  init();
});
function activateMovement() {
  console.log('activating Movement');
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

  // add Event listeners
  $newGame.on('click', newGame);
  $soundButton.on('click', toggleMusic);
  createMap(30,20);
}

// Declare DOM-related Functions

function createMap(height,width) {
  $board.html('');
  if (level > 0) {
    $board.css({ 'height': '90vh', 'width': '90vw' });
  }
  boardSize = height * width;
  boardHeight = height;
  boardWidth = width;
  for (let i = 0; i < boardSize; i++){
    $board.append($(`<div class="floor hidden area" style="width: ${(100 / height )}%; height: ${(100 / width )}%;" data-location="${i}";></div>`));
  }
  addWalls();
  console.log($('.area'));
  $('.area').on('click', makeWall);
}
function makeWall() {
  console.log('I\'m a wall now.');
  $(this).removeClass('floor');
  $(this).addClass('wall');
  console.log($(this).data('location'));
  walls[level].push($(this).data('location'));
}
function addWalls() {
  walls[level].forEach((location) => {
    $(`[data-location="${location}"]`).removeClass('floor');
    $(`[data-location="${location}"]`).addClass('wall');
  } );
}
function getStartingLocation() {
  startingLocation = Math.floor((Math.random() * boardSize));
  while (walls[level].includes(startingLocation)) {
    console.log('preventing spawning in a wall');
    startingLocation = Math.floor((Math.random() * boardSize));
  }
}
function getTreasureLocation() {
  treasureLocation = Math.floor((Math.random() * boardSize));
  while (walls[level].includes(treasureLocation) || treasureLocation === playerLocation) {
    console.log('preventing spawning in a wall');
    treasureLocation = Math.floor((Math.random() * boardSize));
  }
}
function newGame() {
  deactivateMovement();
  createMap(mapDimensions[level][0],mapDimensions[level][1]);
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
  if (key === 87) moveUp();
  if (key === 83) moveDown();
  if (key === 65) moveLeft();
  if (key === 68) moveRight();
  changeVisibility();
  stepsTaken ++;
  checkForWin();
}
function moveUp() {
  if ((playerLocation - boardHeight) < 0 || walls[level].includes((playerLocation - boardHeight)) ) {
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
  if (playerLocation === (boardSize - boardHeight)||(playerLocation + boardHeight) > boardSize || walls[level].includes((playerLocation + boardHeight))) {
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
  if ((playerLocation === 0 || playerLocation % boardHeight === 0 || walls[level].includes((playerLocation - 1)))) {
    console.log('That\'s a wall.');
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
  // This stops movement through top right corner, but also through center of map
  // (playerLocation % boardWidth === boardWidth - 1) ||
  if ((playerLocation % boardHeight === boardHeight - 1) || walls[level].includes((playerLocation + 1))) {
    console.log('That\'s a wall.');
  } else {
    console.log('moving right');
    $(`[data-location="${playerLocation}"]`).html('');
    playerLocation += 1;
    $(`[data-location="${playerLocation}"]`).html('<img src="/images/knight.png">');
    $playerDiv = $('.player');
  }
}
function changeVisibility() {
  visibleSquares = [];
  visibleSquares.push(playerLocation,visionTop(),visionBottom(),visionLeft(),visionRight());
  // $('.area').addClass('hidden');
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
    if (level === 3) {
      $('#scoremessage').removeClass('hide');
      $('#score').html(stepsTaken);
      checkForHighscore();
      window.alert('YOU WIN!!!');
      setTimeout(deactivateMovement, 200);
    } else {
      level ++;
      deactivateMovement();
      newGame();
    }
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
