class SpeedUp extends Phaser.Physics.Arcade.Image{

    constructor(scene) {

        super(scene, 16, 16, "angel");
        scene.add.existing(this);

        scene.powerUps.add(this);
        this.setRandomPosition(0, game.config.height-150, game.config.width, game.config.height-450);

        // setVelocity
        this.setVelocity(100, 100);
        this.setCollideWorldBounds(true);
        this.setBounce(1);

        scene.time.addEvent({ delay: 5000, callback: this.die, callbackScope: this, loop: false});

        this.lifeTime = gameSetting.speedUpLifeTime;
    }

    die() {
        this.destroy();
    }
}