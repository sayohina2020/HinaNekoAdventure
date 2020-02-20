class Ending extends Phaser.Scene {

    uploaded = false;

    constructor() {
        super("ending");
    }

    init(data) {
        if(data.score != undefined)
            this.score = data.score;
        else
            this.score = 0;

        
    }

    create() {
        // background
        this.background = this.add.image(0,0,"background");
        this.background.setOrigin(0,0);
        this.add.image(445, 980, "french-fries").angle = 5;
        this.add.image(395, 980, "french-fries").angle = 355;
        this.add.image(335, 980, "french-fries").angle = 350;
        this.candy = [this.add.image(280, 990, "candy"), this.add.image(280, 1010, "candy"), this.add.image(325, 1010, "candy"), this.add.image(370, 1010, "candy")]
        this.candy[0].angle = 180;
        this.candy[1].angle = 270;
        this.candy[2].angle = 200;
        this.candy.forEach(element => {
            element.setScale(0.8);
        });
        this.add.image(470, 1005, "burger_drink");
        this.add.image(420, 1005, "burger_drink");

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
        this.player = this.add.sprite(config.width/2 + 250, config.height-370, "celebrate_neko");
        this.player.play("celebrate_anim");
        // hina neko
        this.player2 = this.add.sprite(config.width/2 - 240, config.height-370, "celebrate_neko");
        this.player2.play("celebrate_anim");
        this.player2.flipX = true;

        
        // back button
        this.backBtn = this.add.sprite(config.width/2, config.height/2+138, "button").setOrigin(0.5, 0.5);
        this.backBtn.setInteractive();
        this.backLabel = this.add.text(config.width/2, config.height/2+148, 'BACK', {
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

        // UI text
        this.titleLabel = this.add.text(config.width/2, 150, 'Congratulations!', {
            fontFamily: 'Flatwheat',
            fontSize: 80,
            align: 'center',
            strokeThickness: 1,
            stoke: '#fff'
        }).setOrigin(0.5, 0.5);

        this.yourScoreLabel = this.add.text(config.width/2-150, 275, 'Your score is...', {
            fontFamily: 'Flatwheat',
            fontSize: 40,
            align: 'center',
            strokeThickness: 1,
            stoke: '#fff'
        }).setOrigin(0.5, 0.5);

        this.scoreLabel = this.add.text(config.width/2, 430, ''+this.score, {
            fontFamily: 'Flatwheat',
            fontSize: 150,
            align: 'center',
            color: '#3b6668',
            boundsAlignH: "center", 
            boundsAlignV: "middle"
        }).setOrigin(0.5, 0.5);

        // Rank button
        this.rankBtn = this.add.sprite(config.width/2-200, 650, "leaderboard_dis");
        // this.rankBtn.setInteractive();
        // this.rankBtn.on('pointerover', () => {
        //     this.rankBtn.setScale(1.2);
        // });
        // this.rankBtn.on('pointerout', () => {
        //     this.rankBtn.setScale(1.0);
        // });
        // this.rankBtn.on('pointerup', () => {
        //     if(this.uploaded) return;
        //     if(audioOn) this.buttonSFX.play();
        //     this.showInputField();
        // });
        
        // social buttons
        this.fbBtn = this.add.image(config.width/2 - 100, 650, "fb");
        this.fbBtn.setInteractive();
        this.fbBtn.on('pointerover', () => {
            this.fbBtn.setScale(1.2);
        });
        this.fbBtn.on('pointerout', () => {
            this.fbBtn.setScale(1.0);
        });
        this.fbBtn.on('pointerup', () => {
            if(audioOn) this.buttonSFX.play();
            window.open("https://www.facebook.com/sharer/sharer.php?u=https://sayohina2020.github.io/HinaNekoAdventure/&quote=I%20got%20"+this.score+"%20points%20in%20Hina%20Neko's%20Adventure!" +encodeURIComponent("#氷川紗夜日菜生誕祭2020"), "_blank", "toolbar=0,status=0");
        });
        this.twitterBtn = this.add.image(config.width/2, 650, "twitter");
        this.twitterBtn.setInteractive();
        this.twitterBtn.on('pointerover', () => {
            this.twitterBtn.setScale(1.2);
        });
        this.twitterBtn.on('pointerout', () => {
            this.twitterBtn.setScale(1.0);
        });
        this.twitterBtn.on('pointerup', () => {
            if(audioOn) this.buttonSFX.play();
            window.open("https://twitter.com/intent/tweet?text=I%20got%20"+this.score+"%20points%20in%20Hina%20Neko's%20Adventure!"+encodeURIComponent('\nhttps://sayohina2020.github.io/HinaNekoAdventure/\n#氷川紗夜日菜生誕祭2020'), "_blank", "toolbar=0,status=0");
        });
        this.plurkBtn = this.add.image(config.width/2 + 100, 650, "plurk");
        this.plurkBtn.setInteractive();
        this.plurkBtn.on('pointerover', () => {
            this.plurkBtn.setScale(1.2);
        });
        this.plurkBtn.on('pointerout', () => {
            this.plurkBtn.setScale(1.0);
        });
        this.plurkBtn.on('pointerup', () => {
            if(audioOn) this.buttonSFX.play();
            window.open('http://www.plurk.com/m?qualifier=shares&content='.concat(encodeURIComponent('https://i.imgur.com/XY4Y38F.png\nhttps://sayohina2020.github.io/HinaNekoAdventure/')).concat(encodeURIComponent("\nI got "+this.score+" points in Hina neko's Adventure!\n#氷川紗夜日菜生誕祭2020")));
        });
        this.weiboBtn = this.add.image(config.width/2 + 200, 650, "weibo");
        this.weiboBtn.setInteractive();
        this.weiboBtn.on('pointerover', () => {
            this.weiboBtn.setScale(1.2);
        });
        this.weiboBtn.on('pointerout', () => {
            this.weiboBtn.setScale(1.0);
        });
        this.weiboBtn.on('pointerup', () => {
            if(audioOn) this.buttonSFX.play();
            var d=document,e=encodeURIComponent,s1=window.getSelection,s2=d.getSelection,s3=d.selection,s=s1?s1():s2?s2():s3?s3.createRange().text:'',r='http://service.weibo.com/share/share.php?url='+'https://sayohina2020.github.io/HinaNekoAdventure/'+'&title=I got '+this.score+' points in Hina neko\'s Adventure! '.concat(encodeURIComponent('#氷川紗夜日菜生誕祭2020')),x=function(){if(!window.open(r,'weibo','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330'))location.href=r+'&r=1'};if(/Firefox/.test(navigator.userAgent)){setTimeout(x,0)}else{x()};
        });
        this.shareLabel = this.add.text(config.width/2, 580, 'share your score!', {
            fontFamily: 'Flatwheat',
            fontSize: 30,
            align: 'center',
            color: '#3b6668',
            boundsAlignH: "center", 
            boundsAlignV: "middle"
        }).setOrigin(0.5, 0.5);
    }

    // showInputField(scene) {
    //     //var text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});
    //     var element = this.add.dom(config.width/2, -100).createFromCache('nameform');
    //     element.setPerspective(800);
    //     element.addListener('click');
    //     element.on('click', function (event) {
    //         if (event.target.name === 'loginButton')
    //         {
    //             var inputUsername = this.getChildByName('username');
    //             //  Have they entered anything?
    //             if (inputUsername.value !== '')
    //             {
    //                 // Set leaderboard btn disable
    //                 this.scene.uploaded = true;
    //                 this.scene.rankBtn.setTexture("leaderboard_dis");
    //                 this.scene.rankBtn.disableInteractive();
    //                 //  Turn off the click events
    //                 this.removeListener('click');
    //                 //  Tween the login form out
    //                 this.scene.tweens.add({
    //                     targets: element,
    //                     y: config.height+200,
    //                     duration: 3000,
    //                     ease: 'Power3',
    //                     onComplete: function ()
    //                     {
    //                         element.destroy();
    //                     }
    //                 });

    //                 //  Populate the text with whatever they typed in as the username!
    //                 //text.setText('Welcome ' + inputUsername.value);
    //             }
    //             else
    //             {
    //                 //  Flash the prompt
    //                 this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
    //             }
    //         }
    //     });
    //     this.tweens.add({
    //         targets: element,
    //         y: 500,
    //         duration: 3000,
    //         ease: 'Power3'
    //     });
    // }
}