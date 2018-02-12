let level = 0;
let playerWeapon = 'none';
let playerArmor = 'none';
let playerHealth = 3;

const levelMapping = [[2,4,9,11,12,14,18,24,27,32,33,37,38,46,47,52,59,60,62,63,64,66,72,76,79,84,86,91,92,94],[]];

const playerDamageDealt = {
  none: 1,
  dagger: 2,
  sword: 3
};

const playerDamagePrevented = {
  none: 0,
  leather: 0.5,
  chain: 1
};

const enemyDamageDealt = {
  rat: 1,
  goblin: 2
};

// When player runs into enemy trigger combat function

function combat() {
  damagePlayer();
  damageEnemy();
}

function damagePlayer() {
// new Player Healt taken equals Health - (EnemyDamage - playerDamagePrevented(playerArmor))
// If playerHealth === 0 Player loses game
}


// How to check for Enemy ID within this function?
function damageEnemy() {
  // new Enemey Health = Enemy Health - playerDamageDealt(playerWeapon)
  // if EnemyHealth === 0 move Player into Enemy Square and remove Enemy from game
}
