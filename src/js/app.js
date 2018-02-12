console.log('JS locked and loaded');
// Declare global variables

// Declare global functions

let $board = null;
let $newGame = null;
let $playerDiv = null;
let $soundButton = null;
let $healthBar = null;
let audio = null;

let level = 0;
let startingLocation = 0;
let doorLocation = 0;
let enemyLocations = [];
let playerLocation = null;
let boardSize = 0;
let boardHeight = 0;
let boardWidth = 0;

let health = 3;
const walls = [[2,4,9,11,12,14,18,24,27,32,33,37,38,46,47,52,59,60,62,63,64,66,72,76,79,84,86,91,92,94],[3,6,9,15,23,28,33,34,35,36,37,41,44,47,57,59,63,64,66,67,72,77,82,91,93,99,105,109,110,111,114,120,122,123,126,131,135,138,143,158,160,161,163,164,165,166,168,171,178,188,192,197],[3, 33, 63, 93, 123, 122, 120, 181, 211, 212, 213, 214, 243, 273, 303, 333, 363, 393, 423, 453, 483, 573, 271, 331, 391, 451, 541, 542, 543, 336, 366, 396, 426, 456, 486, 516, 337, 367, 397, 427, 457, 487, 517, 215, 217, 218, 219, 220, 250, 280, 340, 370, 400, 460, 520, 550, 580, 461, 462, 463, 492, 522, 584, 554, 464, 466, 465, 556, 558, 588, 561, 591, 559, 467, 469, 470, 471, 472, 502, 532, 562, 592, 185, 125, 126, 127, 97, 67, 37, 68, 69, 70, 40, 10, 71, 72, 102, 132, 221, 133,35, 105, 136, 137, 138, 139, 140, 141, 111, 81, 51, 21, 223, 224, 225, 196, 168, 200, 226, 227, 229, 228, 230, 202, 172, 261, 260, 262, 142, 282, 312, 342, 372, 402, 403, 404, 405, 406, 376, 346, 316, 286, 285, 284, 314, 344, 408, 378, 348, 318, 291, 321, 441, 380, 379, 382, 383, 384, 386, 387, 388, 417, 447, 477, 507, 537, 567, 594, 564, 565, 535, 505, 474, 475, 508, 509, 354, 324, 294, 264, 234, 204, 174, 144, 114, 84, 52, 22, 23, 24, 25, 26, 56, 86, 146, 147, 148, 118, 88,119, 149, 205, 206, 207, 208, 299, 298, 297, 296, 327, 328, 235, 267]];
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
  $healthBar = $('#healthbar');
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
    $board.css({ 'height': '80vh', 'width': '80vw' });
  }
  boardSize = height * width;
  boardHeight = height;
  boardWidth = width;
  for (let i = 0; i < boardSize; i++){
    $board.append($(`<div class="floor hidden area" style="width: ${(100 / height )}%; height: ${(100 / width )}%;" data-location="${i}";></div>`));
  }
  addWalls();
  console.log($('.area'));
  // $('.area').on('click', makeWall);
}
// function makeWall() {
//   console.log('I\'m a wall now.');
//   $(this).removeClass('floor');
//   $(this).addClass('wall');
//   console.log($(this).data('location'));
//   walls[level].push($(this).data('location'));
// }
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
  $(`[data-location="${startingLocation}"]`).addClass('player');
  $(`[data-location="${startingLocation}"]`).html('<img src="/images/knight.png">');
}
function getDoorLocation() {
  doorLocation = Math.floor((Math.random() * boardSize));
  while (walls[level].includes(doorLocation) || doorLocation === playerLocation) {
    console.log('preventing spawning in a wall');
    doorLocation = Math.floor((Math.random() * boardSize));
  }
  $(`[data-location="${doorLocation}"]`).html('<img src="/images/door1.png">');
}
function spawnEnemies(amount) {
  enemyLocations = [];
  for (let i = 0; i < amount; i++){
    enemyLocations.push(Math.floor((Math.random() * boardSize)));
    while (walls[level].includes(enemyLocations[i]) || enemyLocations[i] === playerLocation) {
      console.log('preventing spawning in a wall');
      enemyLocations[i] = (Math.floor((Math.random() * boardSize)));
    }
  }
  for (let j = 0; j < enemyLocations.length; j++) {
    $(`[data-location="${enemyLocations[j]}"]`).html('<img src="/images/giant_rat.gif">');
  }
}
function newGame() {
  deactivateMovement();
  createMap(mapDimensions[level][0],mapDimensions[level][1]);
  getStartingLocation();
  getDoorLocation();
  if (level === 1) {
    spawnEnemies(3);
  }
  if (level === 2) {
    spawnEnemies(6);
  }
  // Set New Player location Div
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
  if (enemyLocations.includes((playerLocation - boardHeight))) {
    if (combat() !== 'win') return;
  }
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
  if (enemyLocations.includes((playerLocation + boardHeight))) {
    if (combat() !== 'win') return;
  }
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
  if (enemyLocations.includes((playerLocation - 1))) {
    if (combat() !== 'win') return;
  }
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
  if (enemyLocations.includes((playerLocation + 1))) {
    if (combat() !== 'win') return;
  }
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
  if ((playerLocation === 0 || playerLocation % boardHeight === 0 )) return ;
  else return playerLocation -1;
}
function visionRight() {
  if (playerLocation % boardHeight === boardHeight - 1) return;
  else return playerLocation + 1;
}
function combat() {
  console.log('fight the beastie');
  health -= 1;
  console.log($('#healthbar img:last-child'));
  $('#healthbar img:last-child').remove();
  if (health > 0) return 'win';
  window.alert('You died!');
  reset();
  newGame();
}
function checkForWin() {
  if (playerLocation === doorLocation) {
    if (level === 2) {
      $('#scoremessage').removeClass('hide');
      $('#score').html(stepsTaken);
      checkForHighscore();
      window.alert('YOU WIN!!!');
      reset();
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
function reset() {
  $('#scoremessage').addClass('hide');
  // Clear board of old sprites
  $('div').removeClass('player');
  $('.floor').html('');
  // startingLocation = Math.floor((Math.random() * boardSize));
  stepsTaken = 0;
  level = 0;
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
