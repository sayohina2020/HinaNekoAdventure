class Preload extends Phaser.Scene {
    constructor() {
        super("bootGame")
    }

    preload() {

        // buttons img
        this.load.image("button", "assets/images/button_1.png");
        this.load.image("button_hover", "assets/images/button_2.png");
        this.load.image("right", "assets/images/grey_sliderRight1.png");

        this.load.image("background", "assets/images/bg.png");
        this.load.image("instruction", "assets/images/instruction.png");

        // hina neko
        this.load.spritesheet("neko", "assets/images/neko.png", {
            frameWidth: 148, 
            frameHeight: 224
        });
        this.load.spritesheet("celebrate_neko", "assets/images/neko_celebrate.png", {
            frameWidth: 154, 
            frameHeight: 253
        });

        // time and score icon
        this.load.image("clock", "assets/images/clock.png");
        this.load.image("basket", "assets/images/picnic-basket.png");

        // food img
        this.load.image("candy", "assets/images/candy.png");
        this.load.image("carrot", "assets/images/carrot.png");
        this.load.image("chicken-leg", "assets/images/chicken-leg.png");
        this.load.image("burger_drink", "assets/images/burger_drink.png");
        this.load.image("french-fries", "assets/images/french-fries.png");
        this.load.image("poop", "assets/images/poop.png");
        this.load.image("to-fu", "assets/images/to-fu2.png");

        // power-up item
        this.load.image("angel", "assets/images/angel.png");

        // social buttons
        this.load.image("leaderboard", "assets/images/rank.png");
        this.load.image("leaderboard_dis", "assets/images/rank_disable.png");
        this.load.image("fb", "assets/images/facebook.png");
        this.load.image("twitter", "assets/images/twitter.png");
        this.load.image("plurk", "assets/images/plurk.png");
        this.load.image("weibo", "assets/images/weibo.png");

        // audio icons
        this.load.image("mute", "assets/images/mute.png");
        this.load.image("openAudio", "assets/images/volume-up.png");

        // sounds
        this.load.audio("good_SFX", "assets/sound/coin01.ogg", "assets/sound/coin01.mp3");
        this.load.audio("bad_SFX", "assets/sound/powerdown01.ogg", "assets/sound/powerdown01.mp3");
        this.load.audio("speedUp_SFX", "assets/sound/powerup03.ogg", "assets/sound/powerup03.mp3");
        this.load.audio("select", "assets/sound/cancel1.ogg", "assets/sound/cancel1.mp3");
        this.load.audio("bgm", "assets/sound/tam-n06loop.ogg", "assets/sound/tam-n06.mp3");
        
    }

    create() {

        bgmObj = this.sound.add("bgm");

        this.buttonSFX = this.sound.add("select");

        this.btn = this.add.text(config.width/2,config.height/2-50,"PLAY", {
            fontFamily: 'Flatwheat',
            fontSize: 100,
            align: 'center',
            color: '#3b6668',
        }).setOrigin(0.5, 0.5);
        this.btn.setInteractive();
        this.btn.on('pointerover', () => {
            this.btn.setColor('#ffffff');
        });
        this.btn.on('pointerout', () => {
            this.btn.setColor('#3b6668');
        });
        this.btn.on('pointerup', () => {
            if(audioOn) {
                this.buttonSFX.play();
                bgmObj.play({ loop: true, mute:!audioOn });
            }
            this.scene.launch("title");
        });

        audioOn = true;

        this.audioIcon = this.add.image(config.width/2, config.height/2 + 100, "openAudio").setOrigin(0.5,0.5);
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
                this.buttonSFX.play();
                this.audioIcon.setTexture('openAudio');
            }
            else this.audioIcon.setTexture('mute');
        });

        // hina neko animation

        this.anims.create({
            key: "neko_anim",
            frames: this.anims.generateFrameNumbers("neko", {
                start: 0,
                end: 1
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "fireneko_anim",
            frames: this.anims.generateFrameNumbers("neko", {
                start: 2,
                end: 3
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "celebrate_anim",
            frames: this.anims.generateFrameNumbers("celebrate_neko"),
            frameRate: 3,
            repeat: -1,
        });

       
    }
}