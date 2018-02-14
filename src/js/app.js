/* global walls itemDefinitions characterDefinitions mapDimensions */
console.log('JS locked and loaded');
// Declare global variables

// const libraries = require('./libraries');

let $board = null;
let $newGame = null;
let $soundButton = null;
let $healthBar = null;
let music = null;
let eventSound = null;

let level = 0;
let player = null;
let door = null;
let enemies = [];
let enemyLocations = [];
let items = [];
let itemLocations = [];
let boardSize = 0;
let boardHeight = 0;
let visibleSquares = [];
let stepsTaken = 0;


// Declare global functions

//Check for DOM loaded
$(function() {
  // run DOM related functions
  init();
});
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
  $('#mapmaker').on('click', activateMapEditor);
  $('#savemap').on('click', saveMap);
}

// Declare DOM-related Classes
class Character {
  constructor(properties) {
    this.location = getCharacterLocation();
    this.moveKeys = {
      87: - boardHeight,
      83: + boardHeight,
      65: - 1,
      68: + 1
    };
    Object.assign(this, properties);
    this.nextLocationUp = this.location + this.moveKeys[87];
    this.nextLocationDown = this.location + this.moveKeys[83];
    this.nextLocationLeft = this.location + this.moveKeys[65];
    this.nextLocationRight = this.location + this.moveKeys[68];
    this.nextLocations = [this.nextLocationUp,this.nextLocationDown,this.nextLocationLeft,this.nextLocationRight];
  }

  attack() {
    // NPC attacks
    combatSound();
    console.log(this.type + ' hits you for ' + (this.damage - player['armor']) + ' damage.');
    player['health'] -= this.damage;
    $('#healthbar img:last-child').remove();
    // Check if player died
    if (player['health'] <= 0) {
      console.log('You were killed by a ' + this.type);
      loseGame();
    // Player Attacks
    } else {
      console.log(`You hit ${this.type} for ${player['damage']} damage!`);
      this.health -= (player['damage'] - this.armor);
    }
    // Check if NPC Died
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
    if (!(key in this.moveKeys)) return;

    // checking if move hits a wall
    if (walls[level].includes(this.location + this.moveKeys[key])) return console.log('That is not a legal move.');

    // check if move hits the boundary
    if (key === 87 && (this.nextLocationUp) < 0)  return console.log('That is not a legal move.');
    if (key === 83) {
      if (this.location === (boardSize - boardHeight) || (this.location + boardHeight) > boardSize) return console.log('That is not a legal move.');
    }
    if (key === 65) {
      if (this.location === 0 || this.location % boardHeight === 0) return console.log('That is not a legal move.');
    }
    if (key === 68 && this.location % boardHeight === boardHeight - 1) return console.log('That is not a legal move.');

    // Check for combat
    if (enemyLocations.includes(this.location + this.moveKeys[key])){
      const enemyFound = enemies.find((obj) =>{
        return obj.location === this.location + this.moveKeys[key];
      });
      enemyFound.attack();
      return;
    }

    // check for items
    if (itemLocations.includes(this.location + this.moveKeys[key])){
      const itemFound = items.find((obj) =>{
        return obj.location === this.location + this.moveKeys[key];
      });
      const index = itemLocations.indexOf(itemFound.location);
      itemLocations.splice(index, 1);
      console.log('You found a ' + itemFound.name);
      player.items.push(itemFound);
      Object.keys(player).forEach(key => {
        if (Object.keys(itemFound).includes(key) && !['location', 'imageSrc', 'name'].includes(key)) {
          player[key] += itemFound[key];
          $(`#${itemFound['type']}`).attr('src',`${itemFound['imageSrc']}`);
        }
      });
    }
    // removing image from old Location
    $(`[data-location="${this.location}"]`).html('');
    //changing Location
    this.location += this.moveKeys[key];
    // adding image to new location
    $(`[data-location="${this.location}"]`).html(`<img src=${this.imageSrc}>`);
    changeVisibility();
    stepsTaken ++;
    checkForWin();
    // Do calculations for next itemLocations
    this.nextLocationUp = this.location + this.moveKeys[87];
    this.nextLocationDown = this.location + this.moveKeys[83];
    this.nextLocationLeft = this.location + this.moveKeys[65];
    this.nextLocationRight = this.location + this.moveKeys[68];
  }
}
class Item {
  constructor(properties) {
    Object.assign(this, properties);
    this.location = getCharacterLocation();
  }
}

// Declare DOM-related Functions

// Functions related to movement
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

// Functions related to Visibility
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

// Map Creation
function createMap(height,width) {
  $board.html('');
  boardSize = height * width;
  boardHeight = height;
  for (let i = 0; i < boardSize; i++){
    $board.append($(`<div class="floor hidden area" style="width: ${(100 / height )}%; height: ${(100 / width )}%;" data-location="${i}";></div>`));
  }
  addWalls();

}
function addWalls() {
  walls[level].forEach((location) => {
    $(`[data-location="${location}"]`).removeClass('floor');
    $(`[data-location="${location}"]`).addClass('wall');
  } );
}
function minimumDistance(item,min) {
  while (Math.abs((player.location-item.location)) < min) {
    console.log('moving ' + item.name + ' further from player');
    item.location = getCharacterLocation();
  }
}

// Start a New Game and Populate Map
function newGame() {
  // scroll to the gameboard
  $('html, body').animate({
    scrollTop: $board.offset().top - 30
  }, 2000);

  deactivateMovement();
  createMap(mapDimensions[level][0],mapDimensions[level][1]);
  reset();
  startingHealth();
  // spawn player
  spawnPlayer();
  // spawn door
  spawnDoor();
  // spawn items
  spawnItems();
  //spawn Enemies - move this to object library
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
function spawnPlayer() {
  // create player object
  player = new Character(characterDefinitions[0]);
  // place player on Map
  $(`[data-location="${player.location}"]`).html(`<img src=${player.imageSrc}>`);
}
function spawnDoor() {
  door = new Item(itemDefinitions[0]);
  // ensure door is not too close to the Player
  minimumDistance(door,49);
  // place door on Map
  $(`[data-location="${door.location}"]`).html(`<img src=${door.imageSrc}>`);
}
function spawnEnemies(amount,level = 1) {
  // create enemies
  for (let i = 0; i < amount; i++){
    // get random Enemy source
    const enemyType = characterDefinitions[level];
    const enemy = new Character(enemyType);
    minimumDistance(enemy,20);
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
    minimumDistance(dagger, 10);
    $(`[data-location="${dagger.location}"]`).html(`<img src=${dagger.imageSrc}>`);
    items.push(dagger);
    itemLocations.push(dagger.location);
  }
  if (level === 2) {
    const sword = new Item(itemDefinitions[2]);
    minimumDistance(sword, 10);
    $(`[data-location="${sword.location}"]`).html(`<img src=${sword.imageSrc}>`);
    items.push(sword);
    itemLocations.push(sword.location);
    const leather = new Item(itemDefinitions[3]);
    minimumDistance(leather, 10);
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
function startingHealth() {
  $healthBar.html('');
  for (let i = 0; i < 3; i++) {
    $healthBar.append('<img src="/images/life.png" alt="A Heart">');
  }
}

// Miscellaneous Options
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

// Map Editor Mode
function activateMapEditor() {
  // toggle this
  var clicks = $(this).data('clicks');
  if (clicks) {
    console.log('mapeditor on');
    $('.area').on('click', mapEditor);
  } else {
    console.log('mapeditor off');
    $('.area').off('click', mapEditor);
  }
  $(this).data('clicks', !clicks);
}
function mapEditor() {
  console.log('I\'m a wall now.');
  $(this).removeClass('floor');
  $(this).addClass('wall');
  console.log($(this).data('location'));
  walls[level].push($(this).data('location'));
}
function saveMap() {
  console.log(walls[level]);
}

// Administrative Functions
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
function loseGame() {
  if (player.health <= 0) {
    $('#scoremessage').removeClass('hide');
    $('#score').html(stepsTaken);
    checkForHighscore();
    window.alert('YOU DIED!');
    reset();
    setTimeout(deactivateMovement, 200);
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
