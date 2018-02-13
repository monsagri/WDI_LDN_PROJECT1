console.log('JS locked and loaded');
// Declare global variables

// Declare global functions

let $board = null;
let $newGame = null;
let $soundButton = null;
let $healthBar = null;
let music = null;
let eventSound = null;

let level = 1;
let player = null;
let door = null;
let enemies = [];
let enemyLocations = [];
let items = [];
let itemLocations = [];


let boardSize = 0;
let boardHeight = 0;
const mapDimensions = [[10,10],[20,10],[30,20]];



const characterDefinitions = [
  {
    type: 'player',
    health: 3,
    damage: 1,
    armor: 0,
    speed: 0,
    imageSrc: '/images/knight.png'
  },
  {
    type: 'rat',
    health: 1,
    damage: 1,
    armor: 0,
    speed: 0,
    imageSrc: '/images/giant_rat.gif'
  },
  {
    type: 'goblin',
    health: 2,
    damage: 1,
    armor: 0,
    speed: 1000,
    imageSrc: '/images/goblin.png'
  },
  {
    type: 'ogre',
    health: 3,
    damage: 2,
    armor: 1,
    speed: 2000,
    imageSrc: '/images/ogre1.png'
  }
];
class Character {
  constructor(properties) {
    Object.assign(this, properties);
    this.location = getCharacterLocation();
    this.moveKey = {
      87: - boardHeight,
      83: + boardHeight,
      65: - 1,
      68: + 1
    };
  }
  attack() {
    combatSound();
    console.log(this.type + ' hits you for ' + (this.damage - player['armor']) + ' damage.');
    player['health'] -= this.damage;
    $('#healthbar img:last-child').remove();
    if (player['health'] <= 0) {
      console.log('You were killed by a ' + this.type);
      return window.alert('You lose!');
    } else {
      console.log(`You hit ${this.type} for ${player['damage']} damage!`);
      this.health -= (player['damage'] - this.armor);
    }
    if (this.health <= 0) {
      // remove the enemy from the map and enemyLocations
      console.log('You killed a ' + this.type);
      const index = enemyLocations.indexOf(this.location);
      enemyLocations.splice(index, 1);
      // move player to enemy location
      $(`[data-location="${player.location}"]`).html('');
      player.location = this.location;
      $(`[data-location="${this.location}"]`).html(`<img src=${player.imageSrc}>`);
    }
  }
  move(key) {
    // check if key is a movekey
    if (!Object.keys(this.moveKey).includes(key.toString())) return;
    // check for enemy encounter

    // checking if move hits a wall
    if (walls[level].includes(this.location + this.moveKey[key])) return console.log('That is not a legal move.');
    // check if move hits the boundary
    if (key === 87 && (this.location - boardHeight) < 0)  return console.log('That is not a legal move.');
    if (key === 83) {
      if (this.location === (boardSize - boardHeight) || (this.location + boardHeight) > boardSize) return console.log('That is not a legal move.');
    }
    if (key === 65) {
      if (this.location === 0 || this.location % boardHeight === 0) return console.log('That is not a legal move.');
    }
    if (key === 68 && this.location % boardHeight === boardHeight - 1) return console.log('That is not a legal move.');
    // Check for combat
    if (enemyLocations.includes(this.location + this.moveKey[key])){
      const enemyFound = enemies.find((obj) =>{
        return obj.location === this.location + this.moveKey[key];
      });
      enemyFound.attack();
      return;
    }
    // removing image from old Location
    $(`[data-location="${this.location}"]`).html('');
    //changing Location
    this.location += this.moveKey[key];
    // adding image to new location
    $(`[data-location="${this.location}"]`).html(`<img src=${this.imageSrc}>`);
    changeVisibility();
    stepsTaken ++;
    checkForWin();
  }
}
const itemDefinitions = [
  {
    name: 'door',
    imageSrc: '/images/door1.png'
  },
  {
    name: 'dagger',
    damage: 2,
    imageSrc: '/images/dagger.png'
  },
  {
    name: 'sword',
    damage: 3,
    imageSrc: '/images/sword.png'
  },
  {
    name: 'leather',
    armor: 1,
    imageSrc: '/images/leather_armor.png'
  },
  {
    name: 'plate',
    armor: 2,
    imageSrc: '/images/plate_armor.png'
  },
  {
    name: 'potion',
    health: +1,
    imageSrc: '/images/health1.png'
  },
  {
    name: 'coin',
    wealth: +1,
    imageSrc: 'images/coin1.png'
  }

];
class Item {
  constructor(properties) {
    Object.assign(this, properties);
    this.location = getCharacterLocation();
  }
}
const walls = [[2,4,9,11,12,14,18,24,27,32,33,37,38,46,47,52,59,60,62,63,64,66,72,76,79,84,86,91,92,94],[3,6,9,15,23,28,33,34,35,36,37,41,44,47,57,59,63,64,66,67,72,77,82,91,93,99,105,109,110,111,114,120,122,123,126,131,135,138,143,158,160,161,163,164,165,166,168,171,178,188,192,197],[3, 33, 63, 93, 123, 122, 120, 181, 211, 212, 213, 214, 243, 273, 303, 333, 363, 393, 423, 453, 483, 573, 271, 331, 391, 451, 541, 542, 543, 336, 366, 396, 426, 456, 486, 516, 337, 367, 397, 427, 457, 487, 517, 215, 217, 218, 219, 220, 250, 280, 340, 370, 400, 460, 520, 550, 580, 461, 462, 463, 492, 522, 584, 554, 464, 466, 465, 556, 558, 588, 561, 591, 559, 467, 469, 470, 471, 472, 502, 532, 562, 592, 185, 125, 126, 127, 97, 67, 37, 68, 69, 70, 40, 10, 71, 72, 102, 132, 221, 133,35, 105, 136, 137, 138, 139, 140, 141, 111, 81, 51, 21, 223, 224, 225, 196, 168, 200, 226, 227, 229, 228, 230, 202, 172, 261, 260, 262, 142, 282, 312, 342, 372, 402, 403, 404, 405, 406, 376, 346, 316, 286, 285, 284, 314, 344, 408, 378, 348, 318, 291, 321, 441, 380, 379, 382, 383, 384, 386, 387, 388, 417, 447, 477, 507, 537, 567, 594, 564, 565, 535, 505, 474, 475, 508, 509, 354, 324, 294, 264, 234, 204, 174, 144, 114, 84, 52, 22, 23, 24, 25, 26, 56, 86, 146, 147, 148, 118, 88,119, 149, 205, 206, 207, 208, 299, 298, 297, 296, 327, 328, 235, 267]];
let visibleSquares = [];
let stepsTaken = 0;


//Check for DOM loaded
$(function() {
  // run DOM related functions
  init();
});
function activateMovement() {
  console.log('activating Movement');
  $('body').keydown(passKey);
}
function deactivateMovement() {
  $('body').off('keydown');
}
function passKey(e) {
  player.move(e.keyCode);
}
function init(){
  console.log('DOM loaded');
  // grab DOM-related variables
  $board = $('.gameboard');
  $newGame = $('#newgame');
  $soundButton = $('#sound');
  music = document.querySelector('#backgroundmusic');
  eventSound = document.querySelector('#eventsound');
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
  $board.css({ 'height': '80vh', 'width': '80vw'});
  boardSize = height * width;
  boardHeight = height;
  for (let i = 0; i < boardSize; i++){
    $board.append($(`<div class="floor hidden area" style="width: ${(100 / height )}%; height: ${(100 / width )}%;" data-location="${i}";></div>`));
  }
  addWalls();
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
function spawnEnemies(amount) {
  // create enemies
  for (let i = 0; i < amount; i++){
    // get random Enemy source
    const enemyType = characterDefinitions[2];
    const enemy = new Character(enemyType);
    enemies.push(enemy);
    enemyLocations.push(enemy['location']);
  }
  // Get images from enemy objects and place on grid
  for (let j = 0; j < enemies.length; j++) {
    $(`[data-location="${enemies[j]['location']}"]`).html(`<img src=${enemies[j]['imageSrc']}>`);
  }
}
function spawnItems(){
  items = [];
  itemLocations = [];
  if (level === 1) {
    const dagger = new Item(itemDefinitions[1]);
    $(`[data-location="${dagger.location}"]`).html(`<img src=${dagger.imageSrc}>`);
    items.push(dagger);
    itemLocations.push(dagger.location);
  }
  if (level === 2) {
    const sword = new Item(itemDefinitions[2]);
    $(`[data-location="${sword.location}"]`).html(`<img src=${sword.imageSrc}>`);
    items.push(sword);
    itemLocations.push(sword.location);
    const leather = new Item(itemDefinitions[3]);
    $(`[data-location="${leather.location}"]`).html(`<img src=${leather.imageSrc}>`);
    items.push(leather);
    itemLocations.push(leather.location);
  }

}
function getCharacterLocation() {
  let enemyLocation = Math.floor((Math.random() * boardSize));
  while (walls[level].includes(enemyLocation)) {
    console.log('preventing spawning in a wall');
    enemyLocation = (Math.floor((Math.random() * boardSize)));
  }
  enemyLocations.push[enemyLocation];
  return enemyLocation;
}
function newGame() {
  deactivateMovement();
  createMap(mapDimensions[level][0],mapDimensions[level][1]);
  reset();
  startingHealth();
  // create player object
  player = new Character(characterDefinitions[0]);
  // place player on Map
  $(`[data-location="${player.location}"]`).html(`<img src=${player.imageSrc}>`);
  // spawn door
  door = new Item(itemDefinitions[0]);
  // place door on Map
  $(`[data-location="${door.location}"]`).html(`<img src=${door.imageSrc}>`);
  //spawn Enemies
  spawnItems();
  if (level === 1) {
    spawnEnemies(3);
  }
  if (level === 2) {
    spawnEnemies(6);
  }
  changeVisibility();
  // Toggle Event Listeners for movement
  activateMovement();
}
function changeVisibility() {
  visibleSquares = [];
  visibleSquares.push(player.location,visionTop(),visionBottom(),visionLeft(),visionRight());
  // $('.area').addClass('hidden');
  visibleSquares.forEach((square) => {
    $(`[data-location="${square}"]`).removeClass('hidden');
  });
}
function visionTop() {
  if ((player.location - boardHeight) < 0) return ;
  else return player.location-boardHeight;
}
function visionBottom() {
  if (player.location === (boardSize - boardHeight)||(player.location + boardHeight) > boardSize) return ;
  else return player.location+boardHeight;
}
function visionLeft() {
  if ((player.location === 0 || player.location % boardHeight === 0 )) return ;
  else return player.location -1;
}
function visionRight() {
  if (player.location % boardHeight === boardHeight - 1) return;
  else return player.location + 1;
}
function checkForWin() {
  if (player.location === door.location) {
    if (level === 2) {
      $('#scoremessage').removeClass('hide');
      $('#score').html(stepsTaken);
      checkForHighscore();
      window.alert('YOU WIN!!!');
      reset();
      setTimeout(deactivateMovement, 200);
    } else {
      level ++;
      enemies = [];
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
  enemies = [];
  enemyLocations= [];
}
function startingHealth() {
  $healthBar.html('');
  for (let i = 0; i < 3; i++) {
    $healthBar.append('<img src="/images/life.png" alt="A Heart">');
  }
}
function toggleMusic(e) {
  e.preventDefault();
  if (music.paused === false) {
    music.pause();
    console.log('music paused');
  } else {
    music.play();
    console.log('music playing');
  }
}
function combatSound() {
  eventSound.src = '/sounds/combat.wav';
  if (eventSound.paused === false) {
    eventSound.pause();
    console.log('eventSound paused');
  } else {
    eventSound.play();
    console.log('eventSound playing');
  }
}
