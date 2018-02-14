/* global walls itemDefinitions characterDefinitions mapDimensions */
console.log('JS locked and loaded');
// Declare global variables

// Dom Variables
let $board = null;
let $newGame = null;
let $soundButton = null;
let $healthBar = null;
let $timerDisplay = null;
let $stepDisplay = null;
let $enemiesKilledDisplay = null;
let music = null;
let eventSound = null;

// Scorekeeping variables
let level = 0;
let stepsTaken = 0;
let enemiesKilled = 0;
let timeTaken = 0;

// Map Variables
let boardSize = 0;
let boardHeight = 0;

// Gameplay Variables
let player = null;
let door = null;
let enemies = [];
let enemyLocations = [];
let items = [];
let itemLocations = [];
let visibleSquares = [];


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
  $timerDisplay = $('#timer');
  $stepDisplay = $('#stepstaken');
  $enemiesKilledDisplay = $('#enemieskilled');
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
    // Apply Player Damage
    player['health'] -= (this.damage - player['armor']);
    // Remove appropiate number of hearts from display
    for (let i = 0; i < (this.damage - player['armor']); i++){
      $('#healthbar img:last-child').remove();
    }
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
      enemiesKilled ++;
      $enemiesKilledDisplay.text(enemiesKilled);
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
      enemyFound.updateDisplay();
      enemyFound.attack();
      enemyFound.updateDisplay();
      return;
    }

    // check for items in new location
    if (itemLocations.includes(this.location + this.moveKeys[key])){
      const itemFound = items.find((obj) =>{
        return obj.location === this.location + this.moveKeys[key];
      });
      // Find index of item in locationlist and remove it
      const index = itemLocations.indexOf(itemFound.location);
      itemLocations.splice(index, 1);
      // Add item to player backpack
      console.log('You found a ' + itemFound.name);
      player.items.push(itemFound);
      // Update player stats according to Item keys and values
      Object.keys(player).forEach(key => {
        if (Object.keys(itemFound).includes(key) && !['location', 'imageSrc', 'name'].includes(key)) {
          player[key] += itemFound[key];
          // If Item is a weapon add its damage to player damage display
          for (let i = 0; i < itemFound.damage; i++){
            console.log('adding ' + itemFound.damage +  ' damage for ' + itemFound.name);
            $('#damage').append(`<img src="/images/fist.png" alt=${itemFound['name']}>`);
          }
          // If Item is armor add its value to player armor display
          for (let i = 0; i < itemFound.armor; i++){
            $('#armor').append(`<img src="/images/leather_armor.png" alt=${itemFound['name']}>`);
          }
          // Add item to backpack
          $('#backpack').append(`<img src=${itemFound['imageSrc']} alt=${itemFound['name']}>`);
        }
      });
    }
    // removing image from old Location
    $(`[data-location="${this.location}"]`).html('');
    //changing Location
    console.log('moving by ' + this.moveKeys[key]);
    this.location += this.moveKeys[key];
    // adding image to new location
    $(`[data-location="${this.location}"]`).html(`<img src=${this.imageSrc}>`);
    changeVisibility();
    stepsTaken ++;
    $stepDisplay.text(stepsTaken);
    checkForWin();
    // Do calculations for next itemLocations
    this.nextLocationUp = this.location + this.moveKeys[87];
    this.nextLocationDown = this.location + this.moveKeys[83];
    this.nextLocationLeft = this.location + this.moveKeys[65];
    this.nextLocationRight = this.location + this.moveKeys[68];
  }
  updateDisplay() {
    // add enemy image
    $('#imagenpc img').remove();
    $('#imagenpc').append(`<img src=${this.imageSrc} alt=${this.name}>`);
    // add lives
    $('#healthbarnpc img').remove();
    for (let i = 0; i < (this.health); i++){
      $('#healthbarnpc').append('<img src="/images/life.png" alt="A Heart">');
    }
    // add Damage
    $('#damagenpc img').remove();
    for (let i = 0; i < (this.damage); i++){
      $('#damagenpc').append('<img src="/images/fist.png" alt="A Fist">');
    }
    // add armor
    $('#armornpc img').remove();
    for (let i = 0; i < (this.armor); i++){
      $('#armornpc').append('<img src="/images/leather_armor.png" alt="Armor">');
    }
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
  //emptying gameboard
  $board.html('');
  // changing global variables to new size
  boardSize = height * width;
  boardHeight = height;
  console.log(boardSize);
  console.log(boardHeight);
  // appending new board
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

  reset();
  createMap(mapDimensions[level][0],mapDimensions[level][1]);
  // spawn player
  startingHealth();
  spawnPlayer();
  // spawn door
  spawnDoor();
  // spawn items
  spawnItems();

  changeVisibility();
  // Toggle Event Listeners for movement
  activateMovement();
  startGameTimer();
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
function spawnEnemies(amount = 1,type = 1) {
  // create enemies
  for (let i = 0; i < amount; i++){
    // get random Enemy source
    const enemyType = characterDefinitions[type];
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
function spawnItems(amount = 1, type = Math.ceil((Math.random() * (itemDefinitions.length -1)))) {
  // If type is not given a random item is spawned
  for (let i = 0; i < amount; i++){
    const itemType = itemDefinitions[type];
    const item = new Item(itemType);
    minimumDistance(item,20);
    items.push(item);
    itemLocations.push(item['location']);
  }
  // Get images from Item objects and place on grid
  for (let j = 0; j < items.length; j++) {
    $(`[data-location="${items[j]['location']}"]`).html(`<img src=${items[j]['imageSrc']}>`);
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
function countGameTime() {
  timeTaken ++;
  $timerDisplay.text(timeTaken);
}
function startGameTimer() {
  setInterval(countGameTime, 1000);
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
      window.alert(`YOU WIN!!! \n It took you ${timeTaken/60} minutes and ${stepsTaken} to reach the end of the Maze. \n You killed ${enemiesKilled} enemies along the way` );
      reset();
      setTimeout(deactivateMovement, 200);
    } else {
      levelUp();
    }
  }
}
function levelUp() {
  level ++;
  // Reset all level related values
  enemies = [];
  items = [];
  itemLocations = [];
  enemyLocations = [];
  // create mapmaker
  createMap(mapDimensions[level][0],mapDimensions[level][1]);
  // set new player location
  player.location = getCharacterLocation();
  // place player on Map
  $(`[data-location="${player.location}"]`).html(`<img src=${player.imageSrc}>`);
  // Update Player moveKeys
  player.moveKeys[87] = - boardHeight;
  player.moveKeys[83] = + boardHeight;
  // Spawn door
  spawnDoor();
  //spawn Enemies - move this to object library
  if (level === 1) {
    spawnEnemies(3,1);
    spawnItems();
    spawnItems();
  }
  if (level === 2) {
    spawnEnemies(3,1);
    spawnEnemies(2,2);
    spawnEnemies(1,3);
    spawnItems();
    spawnItems();
    spawnItems();
    spawnItems();
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
  // Stop Timer
  clearInterval(startGameTimer);
  level = 0;
  stepsTaken = 0;
  enemies = [];
  enemyLocations= [];
  items = [];
  itemLocations = [];
  timeTaken = 0;
  $timerDisplay.html = 0;
}
