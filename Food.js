class Food extends Phaser.GameObjects.Sprite{

    speed = 200;
    type = "";

    constructor(scene) {

        var x = Phaser.Math.Between(40,690);
        var y = 0;
        var type = Phaser.Math.Between(0, gameSetting.food_type.length-1);

        super(scene, x, y, gameSetting.food_type[type]);
        this.type = type;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.velocity.y = this.speed + (gameSetting.time - scene.timeCountdown) / gameSetting.time * 300;

        scene.foods_instance.add(this);
    }

    update(scene) {

        if(this.y > 1000)
            this.destroy();
        else {
            // this.body.velocity.y += 0.98;
        }
    }
}