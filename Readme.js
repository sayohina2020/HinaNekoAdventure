class Readme extends Phaser.Scene {

    constructor() {
        super("readme");
    }

    create() {

        // background
        this.background = this.add.image(0,0,"background");
        this.background.setOrigin(0,0);

        // instruction
        this.instruction = this.add.image(0,0,'instruction').setOrigin(0,0);

        // SFX
        this.buttonSFX = this.sound.add("select");

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

        // hina neko
        this.player = this.add.sprite(config.width/2 + 200, config.height-335, "neko");
        this.player.play("neko_anim");
        this.player.setScale(img_config.neko_scale);

        // back button
        this.backBtn = this.add.sprite(config.width/2, config.height/2+168, "button").setOrigin(0.5, 0.5);
        this.backBtn.setInteractive();
        this.backLabel = this.add.text(config.width/2, config.height/2+178, 'BACK', {
            fontFamily: 'Flatwheat',
            fontSize: 50,
            align: 'center',
            color: '#3b6668'
        }).setOrigin(0.5, 0.5);
        this.backBtn.on('pointerover', () => {
            this.backBtn.setTexture("button_hover");
            this.backLabel.setColor('#ffffff');
        });
        this.backBtn.on('pointerout', () => {
            this.backBtn.setTexture("button");
            this.backLabel.setColor('#3b6668');
        });
        this.backBtn.on('pointerup', () => {
            if(audioOn) this.buttonSFX.play();
            this.scene.start("title");
        });
    }
}