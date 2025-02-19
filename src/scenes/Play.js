let highScore = 0;

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield2').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*7, borderUISize*6 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*7 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)
        this.ship04 = new Spaceship2(this, game.config.width, borderUISize*1.5 + borderPadding*5, 'spaceship2', 0, 50).setOrigin(0,0)
        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        let highScoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 2,
            }
        }

        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 2,
                right: 4,
            },
            fixedWidth: 36
        }
        this.originalTime = game.settings.gameTimer;
        this.add.text(borderUISize + borderPadding + 250, borderUISize + borderPadding*1.5, 'FIRE', fireConfig)
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.highScoreText = this.add.text(borderUISize + 467, borderUISize + borderPadding*2, highScore, highScoreConfig);
        this.timerText = this.add.text(borderUISize + 278, borderUISize + borderPadding*4.3, game.settings.gameTimer / 1000, timeConfig);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.timer = this.time.addEvent({
            delay: 1000, // update every second
            callback: () => {
                if (game.settings.gameTimer > 0) {
                    game.settings.gameTimer -= 1000; // reduce timer by 1 second
                    this.timerText.setText(game.settings.gameTimer / 1000); // update text display
                }
            },
            loop: true
        });

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            game.settings.gameTimer = this.originalTime; // set timer back to original time
            this.scene.restart()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        this.starfield.tilePositionX -= 4;
        if(!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship04)
        }
        if(highScore < this.p1Score)
        {
            highScore = this.p1Score;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');            // play explode animation
        boom.on('animationcomplete', () => {   // callback after anim completes
          ship.reset();                        // reset ship position
          ship.alpha = 1;                      // make ship visible again
          boom.destroy();                      // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        if(this.p1Score > this.highScore)
        {
            highScore = this.p1Score;
            this.highScoreText.text = this.p1Score;
        }
        let explosionNum = Math.floor(Math.random() * 5);
        if(explosionNum === 0)
        {
            this.sound.play('sfx-explosion'); 
        }
        else if(explosionNum === 1)
        {
            this.sound.play('sfx-explosion2'); 
        }
        else if(explosionNum === 2)
        {
            this.sound.play('sfx-explosion3'); 
        }
        else if(explosionNum === 3)
        {
            this.sound.play('sfx-explosion4'); 
        }
        else
        {
            this.sound.play('sfx-explosion5');   
        }  
    }
}