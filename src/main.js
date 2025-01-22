// Author: Nikolas Makranyi
// Title: Rocket Rumble
// Approx. Time: 10 hours
// Mods List: (point values in parenthesis)
// (1) Implement the 'FIRE' UI text from the original game
// (1) Track a high score that persists across scenes and display it in the UI, displayed on the right side of the screen
// (3) Create a new title screen (e.g., new artwork, typography, layout)
// (1) Randomize each spaceship's movement direction at the start of each play
// (1) Allow the player to control the Rocket after it's fired
// (1) Implement the speed increase that happens after 30 seconds in the original game (1)
// (5) Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
// (1) Create a new scrolling tile sprite for the background 

let keySPACE;

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Title, Menu, Play ]
}

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT;

let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;