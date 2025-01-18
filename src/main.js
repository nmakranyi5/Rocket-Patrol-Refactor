// Author: Nikolas Makranyi
// Title: Rocket Rumble
// Approx. Time: 
// Mods List: (point values in parenthesis)
// (1) "FIRE" UI Text
// (1) High Score Tracker, displayed on the right side of the screen




let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT;

let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;