var gameSetting = {
    time: 120,
    playerInitSpeed: 300,
    playerPowerfulTime_max: 5000,
    speedUpLifeTime: 5000,
    food_type: ["candy", "carrot", "chicken-leg", "burger_drink", "french-fries", "poop", "to-fu"],
}

var img_config = {
    neko_x: 148,
    neko_y: 244,
    neko_scale: 0.8,
    item_x: 64,
    item_y: 64,
}

var config = {
    width: 720,
    height: 1280,
    renderer: Phaser.CANVAS,
    parent: 'game',
    backgroundColor: 0x000000,
    scene: [Preload, Title, Readme, GameScene, EndingScene],
    physics: {
        default: "arcade",
        arcade:{
            debug: false,
            debugShowVelocity: false
        }
    },
    dom: {
        createContainer: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

var audioOn = true;
var bgmObj;

var game = new Phaser.Game(config);
var fhsh = document.createElement('script');
var fhs_id_h = "3356416";
fhsh.src = "//freehostedscripts.net/ocount.php?site="+fhs_id_h+"&name=Visits&a=1";
document.body.appendChild(fhsh);
document.write("<span class='visitor' id='h_"+fhs_id_h+"'></span>");
