const mapDimensions = [[10,10],[20,10],[30,20]];
const characterDefinitions = [
  {
    type: 'player',
    health: 3,
    damage: 1,
    armor: 0,
    speed: 0,
    items: [],
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
const itemDefinitions = [
  {
    name: 'door',
    imageSrc: '/images/door1.png'
  },
  {
    type: 'weapon',
    name: 'dagger',
    damage: 1,
    imageSrc: '/images/dagger.png'
  },
  {
    type: 'weapon',
    name: 'sword',
    damage: 2,
    imageSrc: '/images/sword.png'
  },
  {
    type: 'armor',
    name: 'leather',
    armor: 1,
    imageSrc: '/images/leather_armor.png'
  },
  {
    type: 'armor',
    name: 'plate',
    armor: 2,
    imageSrc: '/images/plate_armor.png'
  },
  {
    name: 'potion',
    health: 1,
    imageSrc: '/images/health1.png'
  },
  {
    type: 'items',
    name: 'coin',
    wealth: 1,
    imageSrc: 'images/coin1.png'
  }

];
const walls = [[2,4,9,11,12,14,18,24,27,32,33,37,38,46,47,52,59,60,62,63,64,66,72,76,79,84,86,91,92,94],[3,6,9,15,23,28,33,34,35,36,37,41,44,47,57,59,63,64,66,67,72,77,82,91,93,99,105,109,110,111,114,120,122,123,126,131,135,138,143,158,160,161,163,164,165,166,168,171,178,188,192,197],[3, 33, 63, 93, 123, 122, 120, 181, 211, 212, 213, 214, 243, 273, 303, 333, 363, 393, 423, 453, 483, 573, 271, 331, 391, 451, 541, 542, 543, 336, 366, 396, 426, 456, 486, 516, 337, 367, 397, 427, 457, 487, 517, 215, 217, 218, 219, 220, 250, 280, 340, 370, 400, 460, 520, 550, 580, 461, 462, 463, 492, 522, 584, 554, 464, 466, 465, 556, 558, 588, 561, 591, 559, 467, 469, 470, 471, 472, 502, 532, 562, 592, 185, 125, 126, 127, 97, 67, 37, 68, 69, 70, 40, 10, 71, 72, 102, 132, 221, 133,35, 105, 136, 137, 138, 139, 140, 141, 111, 81, 51, 21, 223, 224, 225, 196, 168, 200, 226, 227, 229, 228, 230, 202, 172, 261, 260, 262, 142, 282, 312, 342, 372, 402, 403, 404, 405, 406, 376, 346, 316, 286, 285, 284, 314, 344, 408, 378, 348, 318, 291, 321, 441, 380, 379, 382, 383, 384, 386, 387, 388, 417, 447, 477, 507, 537, 567, 594, 564, 565, 535, 505, 474, 475, 508, 509, 354, 324, 294, 264, 234, 204, 174, 144, 114, 84, 52, 22, 23, 24, 25, 26, 56, 86, 146, 147, 148, 118, 88,119, 149, 205, 206, 207, 208, 299, 298, 297, 296, 327, 328, 235, 267]];
