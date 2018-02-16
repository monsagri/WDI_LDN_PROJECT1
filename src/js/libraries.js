/* eslint-disable no-unused-vars */
const mainInstructions = '<p class=instructions>Welcome to <strong style="color:red;">Roguelike</strong> <br> You wake up in a small prison with no memory of how you got there and the desperate need to escape. <br> <strong>Controls:</strong> <br> W A S D - for Movement <br> Explore the cave and find items to help you along the way <br> <strong>Combat</strong> <br> You initiate combat by walking into an enemies square. You will each damage each other for your damage value (Fists) minus your armor value (armor). Keep an eye on your healthbar when choosing whether to fight or find a way around an enemy. <br> <strong>Items:</strong> <br>Weapons: Increase your Damage <br> Armor: Reduce the Damage you take <br> Potions: Increase your Health <br> Coins: Increase your final Score <br> <strong>Enemies</strong> <br> The Dungeon contains various enemies, their stats will be displayed on the right when you fight them. Some enemies are stronger than others and as you delve deeper they will start to move as well, so take care! <br> <strong>Score</strong> <br> Your score is calculated from the time you took to reach the end, the amount of steps you took, the amount of enemies you killed and the amount of coins you collected. <br> <strong style="color:red;"> Good luck!</strong></p>';

const instructions1 = 'You were poisoned by an evil wizard and left to die in a little room in this massive abandoned dungeon. <br> Find your way out and have your revenge! <br> Find the door to the next floor.';

const instructions2 = 'Good job! You managed to leave your personal little prison <br> But be careful, there are critters about that have been going hungry for far too long <br> Keep your eyes open for items that might help you during your escape';

const instructions3 = 'You\'ve made it as far as I have come, my friend. <br> Be careful, some of the enemies on this level are restless and wander about in search of food';

const instructions = [instructions1,instructions2,instructions3];

const mapDimensions = [[10,10],[20,10],[30,20],[40,30]];
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
    damage: 2,
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
    type: 'armor',
    name: 'leather',
    armor: 1,
    imageSrc: '/images/leather_armor.png'
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
    imageSrc: 'images/coin.png'
  }

];
const strongItemDefinitions = [
  {
    type: 'armor',
    name: 'plate',
    armor: 2,
    imageSrc: '/images/plate_armor.png'
  },
  {
    type: 'weapon',
    name: 'sword',
    damage: 2,
    imageSrc: '/images/sword.png'
  }
];
const walls = [[2,4,9,11,12,14,18,24,27,32,33,37,38,46,47,52,59,60,62,63,64,66,72,76,79,84,86,91,92,94],[3,6,9,15,23,28,33,34,35,36,37,41,44,47,57,59,63,64,66,67,72,77,82,91,93,99,105,109,110,111,114,120,122,123,126,131,135,138,143,158,160,161,163,164,165,166,168,171,178,188,192,197],[3, 33, 63, 93, 123, 122, 120, 181, 211, 212, 213, 214, 243, 273, 303, 333, 363, 393, 423, 453, 483, 573, 271, 331, 391, 451, 541, 542, 543, 336, 366, 396, 426, 456, 486, 516, 337, 367, 397, 427, 457, 487, 517, 215, 217, 218, 219, 220, 250, 280, 340, 370, 400, 460, 520, 550, 580, 461, 462, 463, 492, 522, 584, 554, 464, 466, 465, 556, 558, 588, 561, 591, 559, 467, 469, 470, 471, 472, 502, 532, 562, 592, 185, 125, 126, 127, 97, 67, 37, 68, 69, 70, 40, 10, 71, 72, 102, 132, 221, 133,35, 105, 136, 137, 138, 139, 140, 141, 111, 81, 51, 21, 223, 224, 225, 196, 168, 200, 226, 227, 229, 228, 230, 202, 172, 261, 260, 262, 142, 282, 312, 342, 372, 402, 403, 404, 405, 406, 376, 346, 316, 286, 285, 284, 314, 344, 408, 378, 348, 318, 291, 321, 441, 380, 379, 382, 383, 384, 386, 387, 388, 417, 447, 477, 507, 537, 567, 594, 564, 565, 535, 505, 474, 475, 508, 509, 354, 324, 294, 264, 234, 204, 174, 144, 114, 84, 52, 22, 23, 24, 25, 26, 56, 86, 146, 147, 148, 118, 88,119, 149, 205, 206, 207, 208, 299, 298, 297, 296, 327, 328, 235, 267],[1, 80, 81, 83, 162, 281, 281, 241, 201, 202, 3, 85, 84, 86, 88, 87, 45, 6, 46, 7, 47, 48, 89, 129, 130, 170, 172, 171, 173, 175, 174, 178, 180, 179, 140, 100, 100, 101, 61, 62, 22, 296, 297, 335, 293, 334, 291, 292, 330, 329, 328, 287, 285, 286, 324, 364, 404, 444, 524, 564, 604, 644, 724, 684, 725, 726, 727, 729, 771, 728, 730, 772, 773, 774, 735, 736, 737, 698, 699, 700, 620, 660, 580, 500, 501, 502, 543, 623, 583, 623, 663, 706, 626, 666, 626, 503, 586, 546, 506, 706,743, 823, 863, 420, 421, 422, 423, 380, 340, 300, 299, 298, 262, 263, 303, 304, 305, 306, 346, 386, 466, 223, 185, 184, 183, 146, 186, 147, 148, 148, 150, 110, 70, 151, 152, 153, 193, 194, 235, 236, 237, 238, 239, 880, 881, 882, 883, 923, 963, 1003, 1002, 1041, 1081, 1161, 1162, 1164, 1163, 1164, 1124, 1085, 1086, 1088, 1047, 1049, 1091, 1050, 1052, 1093, 1054, 1096, 1056, 1057, 1097, 1098, 1058, 1060, 1059, 1059, 1099, 1100, 1010, 1011, 972, 933, 894, 855, 816, 778, 818, 858, 897, 936, 975, 1138, 1178, 1130, 903, 943, 983, 1064, 1065, 1105, 1187, 1147, 1108, 1068, 1028, 988, 989, 991, 992, 993, 1032, 1072, 1112, 1192, 1152, 1148, 1188, 995, 996, 1036, 1076, 1116, 1156, 1196, 997, 999, 746, 786, 826, 906, 946, 986, 827, 828, 868, 869, 870, 871, 872, 876, 877, 878, 879, 836, 756, 716, 717, 718, 719, 636, 676, 596, 556, 516, 517, 519, 709, 710, 670, 669, 673, 674, 714, 714, 713, 593, 595, 591, 589, 587, 468, 469, 429, 428, 388, 388, 389, 393, 394, 434, 433, 473, 474, 230, 270, 271, 231, 411, 413, 453, 494, 534, 574, 613, 653, 651, 570, 530, 490, 450, 451, 454]];
