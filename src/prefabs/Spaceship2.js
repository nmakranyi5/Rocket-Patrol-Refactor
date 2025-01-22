class Spaceship2 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);
        scene.add.existing(this); // add to existing scene
        this.points = pointValue; // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed * 1.5; // spaceship speed in pixels/frame
        this.direction = Math.floor(Math.random() * 2); // randomizing directions, either left or right
        scene.time.delayedCall(30000, this.speedUp, [], this); // speed boost after 30 seconds
    }

    speedUp() {
        this.moveSpeed *= 1.5; 
    }

    update(){
        // move spaceship left
        if(this.direction === 0)
        {
            this.x -= this.moveSpeed;
            // wrap from left to right edge
            if(this.x <= 0 - this.width){
                this.x = game.config.width;
            }
        }
        if(this.direction === 1)
        {
            this.x += this.moveSpeed;
            // wrap from right to left edge
            if(this.x >= game.config.width + this.width) {
                this.x = 0 - this.width;
            }
        }
    }

    reset() {
        this.x = game.config.width;
        this.direction = Math.floor(Math.random() * 2);
    }
}