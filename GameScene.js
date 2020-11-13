class GameScene extends Phaser.Scene {

    playerIdleTimer = 0;
    playerIdleTimerDelta = 0.05;
    scoreText = []

    constructor() {
        super("playGame");
    }

    create() {

        // background
        this.background = this.add.image(0,0,"background");
        this.background.setOrigin(0,0);

        // if touch device, add virtual button, otherwise, add keyboard cursor keys
        if(this.sys.game.device.input.touch) {
            this.touch_device_button();
        }
        else {
            this.cursorKeys = this.input.keyboard.createCursorKeys();
            this.add.text(config.width/2, 1200, "Use your keyboard!", {
                fontFamily: 'Flatwheat',
                fontSize: 40
            }).setOrigin(0.5,0.5);
        }

        // audio icon
        var tag = (audioOn)? "openAudio" : "mute";
        this.audioIcon = this.add.image(config.width-50, 50, tag).setOrigin(0.5,0.5);
        this.audioIcon.setInteractive();
        this.audioIcon.on('pointerover', () => {
            this.audioIcon.setScale(1.2);
        });
        this.audioIcon.on('pointerout', () => {
            this.audioIcon.setScale(1.0);
        });
        this.audioIcon.on('pointerup', () => {
            audioOn = !audioOn;
            if(audioOn) {
                this.audioIcon.setTexture('openAudio');
            }
            else this.audioIcon.setTexture('mute');
            bgmObj.mute = !audioOn;
        });

        // SFX
        this.goodSFX = this.sound.add("good_SFX");
        this.badSFX = this.sound.add("bad_SFX");
        this.speedUpSFX = this.sound.add("speedUp_SFX");

        // hina neko
        this.player = this.physics.add.sprite(config.width/2, config.height-335, "neko");
        this.player.body.setSize(95,180, true);
        this.player.play("neko_anim");
        this.player.setScale(img_config.neko_scale);
        this.player.setCollideWorldBounds(true);
        this.playerSpeed = gameSetting.playerInitSpeed;
        
        // UI text
        this.add.image(30,35, "clock").setDepth(1);
        this.add.image(30,85, "basket").setDepth(1);

        this.timeCountdown = gameSetting.time;
        this.timeLabel = this.add.text(60, 15, '120 sec', {
            fontFamily: 'Flatwheat',
            fontSize: 40
        }).setColor('#606060');
        this.timeLabel.setDepth(1);
        this.time.addEvent({ delay: 1000, callback: this.timeCountdownTick, callbackScope: this, loop: true});

        this.score = 0;
        this.scoreLabel = this.add.text(60, 65, '0 pt', {
            fontFamily: 'Flatwheat',
            fontSize: 40
        }).setColor('#606060');
        this.scoreLabel.setDepth(1);



        // Food
        this.foods_instance = this.add.group(); 
        // create food timer
        this.time.delayedCall(800, this.item_tick, null, this);
        // this.time.addEvent({ delay: 800, callback: this.item_tick, callbackScope: this, repeat: true });

        // Power ups
        this.powerUps = this.physics.add.group();
        // create power-up timer
        this.time.addEvent({ delay: 10000, callback: this.powerUp_tick, callbackScope: this, repeat: 10});
        this.time.delayedCall(100000, () => {
            this.time.addEvent({ delay: 4750, callback: this.powerUp_tick, callbackScope: this, loop: true});
        }, null, this);
        this.powerfulTimer = 0;
    
        
        // Make player be able to collect food
        this.physics.add.overlap(this.player, this.foods_instance, this.pickFood, null, this);

        // Make player can eat speedUp
        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
    }

    update(time, delta) {

        // check game over
        if(this.timeCountdown <= 0) {
            this.scene.start("ending", {score: this.score});
        }

        // Player move
        this.movePlayerManager();

        // Player idle Anim
        this.playerIdleAnim(time);

        // Food fall down
        for(var i = 0; i<this.foods_instance.getChildren().length; i++) {
            var food = this.foods_instance.getChildren()[i];
            // food.update(this);
            if(food.y > 1000)
                food.destroy();
            else {
                food.body.velocity.y += 0.98 * 2;
            }
        }

        // Text update
        this.timeLabel.text = this.timeCountdown + " sec";
        this.scoreLabel.text = this.score + " pt";
        this.scoreTextUpdate();

        // PowerUp timer
        if(this.powerfulTimer > 0) {
            this.powerfulTimer -= delta;
            if(this.powerfulTimer <= 0) {
                this.playerSpeed = gameSetting.playerInitSpeed;
                this.player.anims.play("neko_anim");
                this.player.anims.msPerFrame = 200;
            }
        }
    }

    touch_device_button() {
        this.rightBtn = this.add.image(540, 1200, "right");
        this.rightBtn.setScale(0.8);
        this.leftBtn = this.add.image(180, 1200, "right");
        this.leftBtn.setScale(0.8);
        this.leftBtn.flipX = true;

        this.leftPressing = false;
        this.rightPressing = false;

        this.rightBtn.setInteractive();
        this.leftBtn.setInteractive();
        this.leftBtn.on('pointerdown', () => {
            this.leftPressing = true;
        });
        this.leftBtn.on('pointerout', () => {
            this.leftPressing = false;
        });
        this.rightBtn.on('pointerdown', () => {
            this.rightPressing = true;
        });
        this.rightBtn.on('pointerout', () => {
            this.rightPressing = false;
        });

        if(config.physics.arcade.debug)
            this.porinterStatusLabel = this.add.text(config.width/2, config.height/2-100, '', {
                fontFamily: 'Flatwheat',
                fontSize: 30,
                align: 'center',
                color: '#000000'
            }).setOrigin(0.5,0.5);
    }

    movePlayerManager() {
        if(this.player.alpha < 1) {
            this.player.setVelocity(0);
            if (this.player.anims.isPlaying) {
                this.player.anims.stop(this.player.anims.currentAnim.key);
            }
            return;
        }
        
        if(!this.sys.game.device.input.touch) {     // keyboard
            if(this.cursorKeys.left.isDown) {
                this.player.flipX = false;
                if (!this.player.anims.isPlaying) {
                    this.player.anims.play(this.player.anims.currentAnim.key);
                }
                this.player.setVelocityX(-this.playerSpeed);
            }
            else if (this.cursorKeys.right.isDown) {
                this.player.flipX = true;
                if (!this.player.anims.isPlaying){
                    this.player.anims.play(this.player.anims.currentAnim.key);
                }
                this.player.setVelocityX(this.playerSpeed);
            }
            else {
                this.player.setVelocity(0);
                this.player.anims.stop(this.player.anims.currentAnim.key);
            }
        }
        else {                                      // touch screen
            if(this.leftPressing) {
                this.player.flipX = false;
                if (!this.player.anims.isPlaying) {
                    this.player.anims.play(this.player.anims.currentAnim.key);
                }
                this.player.setVelocityX(-this.playerSpeed);
            }
            else if (this.rightPressing) {
                this.player.flipX = true;
                if (!this.player.anims.isPlaying){
                    this.player.anims.play(this.player.anims.currentAnim.key);
                }
                this.player.setVelocityX(this.playerSpeed);
            }
            else {
                this.player.setVelocity(0);
                this.player.anims.stop(this.player.anims.currentAnim.key);
            }
        }

        
    }

    resetPlayer() {
        this.player.alpha = 1;
    }

    timeCountdownTick() {
        this.timeCountdown--;
    }

    item_tick() {
        // Generate new food
        let x = Phaser.Math.Between(40,690);
        let y = 0;
        let type = Phaser.Math.Between(0, gameSetting.food_type.length-1);
        var food = this.add.image(x, y, gameSetting.food_type[type]);
        food.type = type;
        food.speed = 200;

        this.add.existing(food);

        this.physics.world.enableBody(food);
        food.body.velocity.y = food.speed + (gameSetting.time - this.timeCountdown) / gameSetting.time * 300;

        this.foods_instance.add(food);

        // var food = new Food(this);
        let interval = 800 * (this.timeCountdown/120);
        interval = (interval < 200)? 200 : interval;
        console.log(interval);
        this.time.delayedCall(interval, this.item_tick, null, this);
    }

    powerUp_tick() {
        var powerUp = new SpeedUp(this);
    }

    // Pick food
    pickFood(player, food) {
        
        if(player.alpha < 1) return;
        
        switch (food.type) {
            case 0:
                // candy
                this.score += 10;
                if(audioOn) this.goodSFX.play();
                this.scoreText.push(this.add.text(food.x, food.y, '+10', {
                    fontFamily: 'Flatwheat',
                    fontSize: 30
                }).setColor('#FFFFFF').setShadow(food.x+2, food.y+2, 5, "#000000", true));
                break;
            case 1:
                // carrot
                this.score -= 30;
                if(audioOn) this.badSFX.play();
                this.scoreText.push(this.add.text(food.x, food.y, '-30', {
                    fontFamily: 'Flatwheat',
                    fontSize: 30
                }).setColor('#000000').setShadow(food.x+2, food.y+2, 5, "#000000", true));
                break;
            case 2:
                // chicken-leg
                this.score += 15;
                if(audioOn) this.goodSFX.play();
                this.scoreText.push(this.add.text(food.x, food.y, '+15', {
                    fontFamily: 'Flatwheat',
                    fontSize: 30
                }).setColor('#FFFFFF').setShadow(food.x+2, food.y+2, 5, "#000000", true));
                break;
            case 3:
                // burger_drink
                this.score += 20;
                if(audioOn) this.goodSFX.play();
                this.scoreText.push(this.add.text(food.x, food.y, '+20', {
                    fontFamily: 'Flatwheat',
                    fontSize: 30
                }).setColor('#FFFFFF').setShadow(food.x+2, food.y+2, 5, "#000000", true));
                break;
            case 4:
                // french-fries
                this.score += 50;
                if(audioOn) this.goodSFX.play();
                this.scoreText.push(this.add.text(food.x, food.y, '+50', {
                    fontFamily: 'Flatwheat',
                    fontSize: 30
                }).setColor('#FFFFFF').setShadow(food.x+2, food.y+2, 5, "#000000", true));
                break;
            case 5:
                // poop
                player.alpha = 0.5;
                if(audioOn) this.badSFX.play();
                this.scoreText.push(this.add.text(food.x, food.y, 'POOP!', {
                    fontFamily: 'Flatwheat',
                    fontSize: 30
                }).setColor('#000000').setShadow(food.x+2, food.y+2, 5, "#000000", true));
                this.time.addEvent({
                    delay: 3000,
                    callback: this.resetPlayer,
                    callbackScope: this,
                    loop: false
                });
                break;
            case 6:
                // to-fu
                this.score -= 30;
                if(audioOn) this.badSFX.play();
                this.scoreText.push(this.add.text(food.x, food.y, '-30', {
                    fontFamily: 'Flatwheat',
                    fontSize: 30
                }).setColor('#000000').setShadow(food.x+2, food.y+2, 5, "#000000", true));
                break;
        }


        food.destroy();
    }

    pickPowerUp(player, powerUp) {

        if(player.alpha < 1) return;
        if(audioOn) this.speedUpSFX.play();
        this.powerfulTimer = gameSetting.playerPowerfulTime_max;
        this.playerSpeed *= 2;
        this.player.anims.play("fireneko_anim");
        this.player.anims.msPerFrame = 30000 / this.playerSpeed;
        powerUp.disableBody(true, true);
        this.scoreText.push(this.add.text(player.x-60, player.y-100, 'S', {
            fontFamily: 'Flatwheat',
            fontSize: 30
        }).setColor('#FF0000'));
        this.scoreText.push(this.add.text(player.x-40, player.y-100, 'P', {
            fontFamily: 'Flatwheat',
            fontSize: 30
        }).setColor('#FF7F00'));
        this.scoreText.push(this.add.text(player.x-20, player.y-100, 'E', {
            fontFamily: 'Flatwheat',
            fontSize: 30
        }).setColor('#FFFF00'));
        this.scoreText.push(this.add.text(player.x, player.y-100, 'E', {
            fontFamily: 'Flatwheat',
            fontSize: 30
        }).setColor('#00FF00'));
        this.scoreText.push(this.add.text(player.x+20, player.y-100, 'D', {
            fontFamily: 'Flatwheat',
            fontSize: 30
        }).setColor('#0000FF'));
        this.scoreText.push(this.add.text(player.x+40, player.y-100, 'U', {
            fontFamily: 'Flatwheat',
            fontSize: 30
        }).setColor('#2E2B5F'));
        this.scoreText.push(this.add.text(player.x+60, player.y-100, 'P', {
            fontFamily: 'Flatwheat',
            fontSize: 30
        }).setColor('#8B00FF'));
        this.scoreText.push(this.add.text(player.x+80, player.y-100, '!', {
            fontFamily: 'Flatwheat',
            fontSize: 30
        }).setColor('#000000'));
    }

    scoreTextUpdate()
    {
        let arr = this.scoreText.slice(0);
        this.scoreText.length = 0;
        arr.forEach(e => {
            let value = e.alpha - 0.015;
            if(value > 0) {
                e.y -= 2;
                e.alpha = value;
                this.scoreText.push(e);
            }
            else {
                e.destroy();
            }
        });
    }

    playerIdleAnim(t)
    {
        if(this.player.alpha < 1) return;
        if(this.player.body.velocity.x != 0) return;

        if(this.playerIdleTimerDelta > 0 && this.playerIdleTimer > 1)
        {
            this.playerIdleTimerDelta *= -1;
            this.playerIdleTimer = 1;
        }
        else if(this.playerIdleTimerDelta < 0 && this.playerIdleTimer < 0)
        {
            this.playerIdleTimerDelta *= -1;
            this.playerIdleTimer = 0;
        }
        else {
            this.playerIdleTimer += this.playerIdleTimerDelta;
        }
        this.player.y = Phaser.Math.Interpolation.SmoothStep(this.playerIdleTimer, 940, 950);
    }

    endGame() {
        this.input.keyboard.shutdown();

    }
}

