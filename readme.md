![image](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)

# GA WDI-30 Project 1 - Roguelike

For our first project, we were given four days to design and build an in-browser game using HTML, CSS and JavaScript (jQuery library used). Roguelike is a homage to oldschool games such as Rogue. I loved playing these types of games as a kid and being able to make one of my own was a great validation of the skills we have learned

##### [Visit website](https://fathomless-depths-12534.herokuapp.com/) for best playing experience (the game was not designed for mobile).

---

## Setup instructions

- Clone or download the repo
- Install dependencies with `yarn install`
- Launch the app with `gulp`

>**NB**: You will need to have installed `gulp-cli` globally

---
# Game Description
<p align="center"><img src="https://i.imgur.com/xTB0rey.png" width="700"></p>

###### Roguelike takes place in a grid-based environment. The map structure was hand generated by me using the Map Maker function I built in. The player, enemies and items are spawned in random locations each time a map loads. Enemies and Items can be randomly chosen or specifically selected in the JS file.

<p align="center"><img src="https://i.imgur.com/UAOYjbd.png" width="700"></p>

###### Each level starts with its own intro message giving the player some information about what to expect.

---

<p align="center"><img src="https://i.imgur.com/QX0LJiQ.jpg" width="700"></p>

 Level one serves as an introduction to the basic game concept. The player explores a small map which contains one item and the door to the next level. As with all levels, once the player reaches the door, the map is revealed to show what was potentially missed.

<p align="center"><img src="https://i.imgur.com/hSgXi72.png" width="700"></p>

 Level two adds enemies to the map, as well as more items. This gives the player a first experience of combat within the game. The map size is increased as well.

<p align="center"><img src="https://i.imgur.com/Ydcw1zZ.png" width="700"></p>

 In level 3 the enemies move function is activated and the player is confronted with new enemy types, as well as the risk of being caught out by moving enemies.

<p align="center"><img src="https://i.imgur.com/nZs7bGI.png" width="700"></p>

 Level four is the final level. No new features are introduced at this point, it is simply a larger level to push the player to their limits.

---

 The Win Logic requires the player to reach the final door without being reduced to 0 hitpoints on the way.

 The players score is calculated using a formula that takes into account the time taken, steps taken, enemies killed and coins collected.

 Once the final level is beaten, the player is presented with their final score and can restart the entire game and try to beat it. The highscore is displayed above the game board.

---
# Planned Features

 I would like to find a way to procedurally generate maps. This was a goal of mine early during development that I had to abandon due to time constraints, but it is something I would love to revisit.

 Adding more enemy types and item definitions would be another great option.

 Finally I would like to improve on the design to make it fully scaleable to any screen size and to integrate the Arcade Machine Background into the game further.

---
# In Review

I am very pleased with the final product. While there are several small design changes I would like to make, I believe that I captured the feeling of Roguelike games quite well.

The game framework is robust and adding new item or enemy definitions is simply a matter of updating the definition list in the libraries.js file.
Similarly a new map can easily be created using the Map Maker on a blank new level.
